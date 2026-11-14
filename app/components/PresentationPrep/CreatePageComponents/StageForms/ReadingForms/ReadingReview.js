"use client";
// ReadingReview.js — the reading "Review & Build" page. Sits between Source and
// Arrange (the text analogue of listening's CreateAudioSnippets). It turns the
// raw screenshots into structured, enriched data and shows it for review/edit:
//
//   • builds readingItems from the Q&A screenshots (auto on entry)
//   • generates, in parallel: per-question PASSAGES (/api/get-reading-passages),
//     ANSWER EXPLANATIONS (/api/get-reading-explanation), and CEFR LEVELS
//     (/api/rate-difficulty) — bulk button + per-item regenerate
//   • inline-edit question / answer / passages / explanation
//   • flags questions that have no text (upload the questions page, or type it)
//
// readingItems is the source of truth (useReadingStore); edits/writes persist
// via its own subscription. Vocab-hunt enrichment is a later panel.

import { useEffect, useRef, useState } from "react";
import { useReadingStore } from "@app/stores/useReadingStore";
import {
  buildReadingItemsFromStrings,
  wholeTextString,
  textParagraphs,
  paragraphOf,
} from "@app/components/FinalPresentationSections/readingDetailModel";

const LEVEL_COLORS = {
  A1: "#2e7d32", A2: "#558b2f", B1: "#f9a825", B2: "#ef6c00", C1: "#c62828", C2: "#6a1b9a",
};

export default function ReadingReview() {
  const readingItems = useReadingStore((s) => s.readingItems) ?? [];
  const setReadingItems = useReadingStore((s) => s.setReadingItems);
  const updateReadingItem = useReadingStore((s) => s.updateReadingItem);
  const updateReadingItemPassages = useReadingStore((s) => s.updateReadingItemPassages);
  const textbook = useReadingStore((s) => s.textbook);

  const [busy, setBusy] = useState(false);
  const [busyIdx, setBusyIdx] = useState(null);
  const [err, setErr] = useState("");
  const builtOnce = useRef(false);

  // Build items from the screenshots once, if we don't have them yet.
  useEffect(() => {
    if (builtOnce.current) return;
    const { questions, answers, readingItems: cur } = useReadingStore.getState();
    if ((!cur || cur.length === 0)) {
      const built = buildReadingItemsFromStrings({ questions, answers });
      if (built.length) { setReadingItems(built); builtOnce.current = true; }
    } else {
      builtOnce.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = wholeTextString(textbook);
  const hasText = !!text.trim();
  const hasItems = readingItems.length > 0;
  const paragraphs = textParagraphs(text);

  const qaOf = (items) => items.map((it) => ({ number: it.number, question: it.question, answer: it.answer }));

  const rebuild = () => {
    const { questions, answers } = useReadingStore.getState();
    const built = buildReadingItemsFromStrings({ questions, answers }, readingItems);
    if (!built.length) { setErr("No questions or answers found on the Source page yet."); return; }
    if (readingItems.length && !window.confirm("Rebuild question & answer text from the latest screenshots? (Evidence passages are kept by number.)")) return;
    setErr("");
    setReadingItems(built);
  };

  async function callAll(items) {
    const qa = qaOf(items);
    const questionsForCefr = items.map((it) => ({ question: it.question, answer: it.answer }));
    const [pRes, eRes, dRes] = await Promise.all([
      fetch("/api/get-reading-passages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, questionsAndAnswers: qa }) }),
      fetch("/api/get-reading-explanation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, questionsAndAnswers: qa }) }),
      fetch("/api/rate-difficulty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript: text, questions: questionsForCefr }) }),
    ]);
    // Surface which call failed (a missing route 404s silently otherwise).
    const failures = [];
    if (!pRes.ok) failures.push(`passages (HTTP ${pRes.status})`);
    if (!eRes.ok) failures.push(`explanations (HTTP ${eRes.status})`);
    if (!dRes.ok) failures.push(`levels (HTTP ${dRes.status})`);
    if (failures.length) setErr(`Couldn't generate: ${failures.join(", ")}. Check that each /api route exists.`);
    const pData = pRes.ok ? await pRes.json() : { results: [] };
    const eData = eRes.ok ? await eRes.json() : { results: [] };
    const dData = dRes.ok ? await dRes.json() : { ratings: [] };
    const pByNum = new Map((pData.results || []).map((r) => [String(r.number), r.passages || []]));
    const eByNum = new Map((eData.results || []).map((r) => [String(r.number), r.explanation || ""]));
    const ratings = Array.isArray(dData.ratings) ? dData.ratings : [];
    return items.map((it, i) => {
      const p = pByNum.get(String(it.number));
      const e = eByNum.get(String(it.number));
      const cefr = ratings[i] && ratings[i].level ? { level: ratings[i].level, reason: ratings[i].reason || "" } : it.cefr;
      return {
        ...it,
        passages: p ? p.map((t) => ({ text: t })) : it.passages,
        explanation: typeof e === "string" && e ? e : it.explanation,
        cefr,
      };
    });
  }

  const generateAll = async () => {
    if (!hasText) { setErr("Add the reading-text screenshot on the Source page first."); return; }
    if (!hasItems) { setErr("No questions yet — rebuild from screenshots first."); return; }
    setErr(""); setBusy(true);
    try {
      const merged = await callAll(readingItems);
      setReadingItems(merged);
    } catch (e) { console.error(e); setErr("Generation failed. Try again."); }
    finally { setBusy(false); }
  };

  const regenerateOne = async (index) => {
    if (!hasText) { setErr("Add the reading-text screenshot on the Source page first."); return; }
    setErr(""); setBusyIdx(index);
    try {
      const one = await callAll([readingItems[index]]);
      const next = [...readingItems];
      next[index] = one[0];
      setReadingItems(next);
    } catch (e) { console.error(e); setErr("Couldn't regenerate that item."); }
    finally { setBusyIdx(null); }
  };

  // passages editor helpers
  const pText = (it) => (Array.isArray(it.passages) ? it.passages : []).map((p) => (typeof p === "string" ? p : p?.text || ""));
  const setPassageAt = (index, pIdx, value) => { const cur = pText(readingItems[index]); cur[pIdx] = value; updateReadingItemPassages(index, cur.map((t) => ({ text: t }))); };
  const addPassage = (index) => updateReadingItemPassages(index, [...pText(readingItems[index]), ""].map((t) => ({ text: t })));
  const removePassage = (index, pIdx) => updateReadingItemPassages(index, pText(readingItems[index]).filter((_, j) => j !== pIdx).map((t) => ({ text: t })));

  const missingText = (it) => !it.question || it.question.trim() === `Number ${it.number}`;

  return (
    <div style={st.page}>
      <div style={st.head}>
        <div>
          <h2 style={st.title}>Review &amp; build</h2>
          <p style={st.sub}>Check the questions, answers and evidence before you arrange slides. Generate the passages, explanations and levels, then edit anything that needs fixing.</p>
        </div>
        <div style={st.headBtns}>
          <button style={st.ghost} onClick={rebuild}>⟳ Rebuild from screenshots</button>
          <button style={st.gen} onClick={generateAll} disabled={busy || !hasItems || !hasText}>
            {busy ? "Generating…" : "✦ Generate passages, explanations & levels"}
          </button>
        </div>
      </div>

      {err && <div style={st.err}>{err}</div>}
      {!hasText && <div style={st.warn}>No reading text yet — add the text screenshot on the Source page so evidence and explanations can be generated.</div>}

      {!hasItems && (
        <div style={st.empty}>No questions yet. Upload the questions and answer-key screenshots on the Source page, then press <strong>Rebuild from screenshots</strong>.</div>
      )}

      <div style={st.list}>
        {readingItems.map((it, index) => {
          const passages = pText(it);
          const loading = busyIdx === index;
          return (
            <div key={`${it.number}-${index}`} style={{ ...st.block, ...(loading ? st.blockBusy : {}) }}>
              <div style={st.topRow}>
                <span style={st.qNum}>{it.number}</span>
                <div style={st.grow}>
                  <EditableText value={it.question} onCommit={(v) => updateReadingItem(index, "question", v)} style={st.question} placeholder="Question text…" />
                  {missingText(it) && <div style={st.missing}>⚠ No question text — type it here, or upload the questions page on Source.</div>}
                </div>
                {it.cefr?.level && <span style={{ ...st.cefr, background: LEVEL_COLORS[it.cefr.level] || "#555" }} title={it.cefr.reason || ""}>{it.cefr.level}</span>}
                <button style={st.regen} onClick={() => regenerateOne(index)} disabled={loading}>{loading ? "…" : "↻"}</button>
              </div>

              <div style={st.aRow}>
                <span style={st.tag}>Answer</span>
                <EditableText value={it.answer} onCommit={(v) => updateReadingItem(index, "answer", v)} style={st.answer} placeholder="Answer…" />
              </div>

              <div style={st.sub2}>
                <span style={st.tag}>In the text</span>
                {passages.length === 0 && <span style={st.faint}>No evidence yet — generate above, or add a line.</span>}
                {passages.map((p, pIdx) => {
                  const para = paragraphOf(p, paragraphs);
                  return (
                    <div key={pIdx} style={st.pRow}>
                      <span style={{ ...st.para, ...(para ? {} : st.paraNone) }} title={para ? `Paragraph ${para}` : "Not found in the text"}>{para ? `¶${para}` : "¶?"}</span>
                      <textarea style={st.area} rows={1} value={p} onChange={(e) => setPassageAt(index, pIdx, e.target.value)} placeholder="Exact sentence from the text…" />
                      <button style={st.x} onClick={() => removePassage(index, pIdx)} aria-label="Remove">×</button>
                    </div>
                  );
                })}
                <button style={st.addSm} onClick={() => addPassage(index)}>+ Add evidence</button>
              </div>

              <div style={st.sub2}>
                <span style={st.tag}>Why</span>
                <EditableText value={it.explanation || ""} onCommit={(v) => updateReadingItem(index, "explanation", v)} style={st.expl} placeholder="Explanation of the answer…" multiline />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditableText({ value, onCommit, style, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); const n = ref.current.value.length; ref.current.setSelectionRange(n, n); } }, [editing]);
  const commit = () => { setEditing(false); if (draft !== value) onCommit(draft); };
  if (editing) {
    return (
      <textarea ref={ref} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); } if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
        rows={1} style={{ ...style, ...edit.input }} />
    );
  }
  return (
    <span style={{ ...style, ...edit.display }} onClick={() => setEditing(true)} title="Click to edit">
      {value || <span style={edit.ph}>{placeholder}</span>}
    </span>
  );
}

const edit = {
  display: { cursor: "text", borderBottom: "1px dashed #d8d3c7" },
  input: { width: "100%", minWidth: 240, border: "1px solid #2f7d76", borderRadius: 6, padding: "6px 10px", font: "inherit", resize: "vertical", background: "#fff" },
  ph: { color: "#b8b3a8", fontStyle: "italic" },
};

const st = {
  page: { maxWidth: 820, margin: "0 auto", padding: "8px 16px 40px" },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 },
  title: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, color: "#1c1c1e", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6f6b63", margin: 0, maxWidth: 520 },
  headBtns: { display: "flex", gap: 8, flexWrap: "wrap" },
  ghost: { border: "1px solid #e6e3db", background: "#fff", color: "#6f6b63", borderRadius: 9, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit" },
  gen: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit" },
  err: { fontSize: 13.5, color: "#b4532f", background: "#fbeee9", border: "1px solid #f0d6cc", borderRadius: 9, padding: "8px 11px", marginBottom: 12 },
  warn: { fontSize: 13.5, color: "#8a6d1f", background: "#fcf6e3", border: "1px solid #ecdfb0", borderRadius: 9, padding: "8px 11px", marginBottom: 12 },
  empty: { fontSize: 15, color: "#6f6b63", background: "#fbfaf7", border: "1px dashed #e6e3db", borderRadius: 12, padding: "22px 18px", textAlign: "center" },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  block: { padding: 16, border: "1px solid #f0eee8", borderRadius: 12, background: "#fbfaf7", transition: "opacity .15s ease" },
  blockBusy: { opacity: 0.6 },
  topRow: { display: "flex", gap: 10, alignItems: "flex-start" },
  grow: { flex: 1, minWidth: 0 },
  qNum: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 600, color: "#2f7d76", flexShrink: 0 },
  question: { fontWeight: 600, fontSize: 16.5, color: "#1c1c1e", display: "inline-block", width: "100%" },
  missing: { fontSize: 12.5, color: "#b4532f", marginTop: 4 },
  cefr: { flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", padding: "3px 9px", borderRadius: 20, cursor: "default" },
  regen: { flexShrink: 0, border: "1px solid #e6e3db", background: "#fff", color: "#2f7d76", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 15 },
  aRow: { display: "flex", gap: 6, alignItems: "baseline", marginTop: 10 },
  tag: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", flexShrink: 0, minWidth: 64 },
  answer: { fontSize: 15.5, color: "#3a3a3a", flex: 1 },
  sub2: { marginTop: 10, paddingTop: 10, borderTop: "1px dashed #ece8df", display: "flex", flexDirection: "column", gap: 6 },
  faint: { fontSize: 12.5, color: "#b8b3a8", fontStyle: "italic" },
  pRow: { display: "flex", gap: 6, alignItems: "flex-start" },
  para: { flexShrink: 0, marginTop: 5, fontSize: 12, fontWeight: 700, color: "#1c4a45", background: "#e7efed", borderRadius: 6, padding: "2px 7px", minWidth: 28, textAlign: "center" },
  paraNone: { color: "#b4532f", background: "#fbeee9" },
  area: { flex: 1, border: "1px solid #e6e3db", borderRadius: 8, padding: "6px 9px", fontSize: 13.5, color: "#2b2b2b", background: "#fff", font: "inherit", fontStyle: "italic", resize: "vertical" },
  expl: { fontSize: 14.5, color: "#3a3a3a", display: "inline-block", width: "100%" },
  addSm: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "5px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 18, fontWeight: 700, lineHeight: 1, paddingTop: 4 },
};
