"use client";
// GistReadingCard.js — Configure card for the "Reading for gist" stage.
// Book reference (title) is shared source data (useReadingStore.inputTexts).
// The gist QUESTION is generated from the reading text via /api/generate-gist
// (same generator listening uses) and stored in the shared gistOptions/
// selectedGist. Stage-local config (stageActivities[item.id].config): time,
// showTimer, and the embedded partner-check (checkOn + A/B phrases).

import { useState } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CONFIG_DEFAULTS = {
  timeMinutes: 3,
  showTimer: true,
  checkOn: false,
  checkPhrases: DEFAULT_PHRASES,
};

function textbookToText(tb) {
  if (!tb) return "";
  if (typeof tb === "string") return tb;
  if (Array.isArray(tb.textEdit)) return tb.textEdit.filter(Boolean).join("\n\n");
  if (typeof tb.text === "string") return tb.text;
  try { return JSON.stringify(tb); } catch { return ""; }
}

export default function GistReadingCard({ item, position }) {
  const stageId = item.id;
  const config = useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore((s) => s.updateStageActivityConfig);

  const gistOptions = useAudioTextStore((s) => s.gistOptions);
  const selectedGist = useAudioTextStore((s) => s.selectedGist);
  const updateGistOptions = useAudioTextStore((s) => s.updateGistOptions);
  const updateSelectedGist = useAudioTextStore((s) => s.updateSelectedGist);

  const inputTexts = useReadingStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useReadingStore((s) => s.updateInputTextForKey);
  const textbook = useReadingStore((s) => s.textbook);
  const questions = useReadingStore((s) => s.questions);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const setCfg = (patch) => updateStageActivityConfig(stageId, patch);
  const c = { ...CONFIG_DEFAULTS, ...config };
  const phrases = Array.isArray(c.checkPhrases) ? c.checkPhrases : DEFAULT_PHRASES;
  const hasOptions = Array.isArray(gistOptions) && gistOptions.length > 0;

  const generate = async () => {
    const text = textbookToText(textbook);
    if (!text.trim()) { setErr("Add the reading on the Source page first."); return; }
    const qArr = Array.isArray(questions?.questions) ? questions.questions : [];
    const detailQuestions = qArr.map((q) => (q?.text || "").trim()).filter(Boolean);
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/generate-gist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, detailQuestions }),
      });
      const data = await res.json();
      if (Array.isArray(data.options)) updateGistOptions(data.options);
      else setErr("Couldn't generate. Try again.");
    } catch (e) { console.error(e); setErr("Couldn't generate. Try again."); }
    finally { setLoading(false); }
  };

  const setPhrase = (i, v) => { const n = [...phrases]; n[i] = v; setCfg({ checkPhrases: n }); };
  const addPhrase = () => setCfg({ checkPhrases: [...phrases, ""] });
  const removePhrase = (i) => setCfg({ checkPhrases: phrases.filter((_, j) => j !== i) });

  return (
    <CardShell position={position} label="Reading for gist">
      <div style={st.hint}>Book reference is shared with your source.</div>
      <label style={st.lbl}>
        Text title
        <input style={st.in} value={inputTexts.title || ""} onChange={(e) => updateInputTextForKey("title", e.target.value)} placeholder="e.g. A day in Hanoi" />
      </label>

      {/* Gist question — generated from the reading text */}
      <div style={st.section}>
        <div style={st.secHead}>
          <span style={st.secTitle}>Gist question</span>
          <button style={st.gen} onClick={generate} disabled={loading}>
            {loading ? "…" : hasOptions ? "Regenerate" : "✦ Generate"}
          </button>
        </div>
        {err && <div style={st.err}>{err}</div>}
        {!hasOptions && !err && <div style={st.note}>Generate a main-idea question from your reading text.</div>}
        {hasOptions && (
          <div style={st.opts}>
            {gistOptions.map((opt, i) => {
              const picked = selectedGist && selectedGist.question === opt.question;
              return (
                <button key={i} onClick={() => updateSelectedGist(opt)} style={{ ...st.opt, ...(picked ? st.optPicked : {}) }}>
                  <span style={st.optQ}>{opt.question}</span>
                  <span style={st.optA}>Answer: {opt.answer}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded partner check */}
      <div style={st.section}>
        <label style={st.toggle}>
          <input type="checkbox" checked={!!c.checkOn} onChange={(e) => setCfg({ checkOn: e.target.checked })} />
          Partner check before answers
        </label>
        {c.checkOn && (
          <div style={st.phr}>
            {phrases.map((p, i) => (
              <div key={i} style={st.prow}>
                <span style={st.tag}>{i % 2 === 0 ? "A" : "B"}</span>
                <input style={st.in} value={p} onChange={(e) => setPhrase(i, e.target.value)} />
                <button style={st.x} onClick={() => removePhrase(i)} aria-label="Remove">×</button>
              </div>
            ))}
            <button style={st.add} onClick={addPhrase}>+ Add line</button>
          </div>
        )}
      </div>

      <div style={st.row}>
        <label style={{ ...st.lbl, ...st.sm }}>
          Time (min)
          <input type="number" min="1" style={st.in} value={c.timeMinutes} onChange={(e) => setCfg({ timeMinutes: Number(e.target.value) || 1 })} />
        </label>
        <label style={st.check}>
          <input type="checkbox" checked={!!c.showTimer} onChange={(e) => setCfg({ showTimer: e.target.checked })} />
          Show time limit
        </label>
      </div>
    </CardShell>
  );
}

const st = {
  hint: { fontSize: 12, color: "#8a857a", fontStyle: "italic", marginBottom: 10 },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 120px", minWidth: 100 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit", flex: 1 },
  section: { marginTop: 16, paddingTop: 14, borderTop: "1px solid #eee7da" },
  secHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  secTitle: { fontSize: 13, fontWeight: 700, color: "#44423d" },
  gen: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 9, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit" },
  note: { fontSize: 13, color: "#8a857a", fontStyle: "italic" },
  err: { fontSize: 13, color: "#b4532f", marginBottom: 6 },
  opts: { display: "flex", flexDirection: "column", gap: 8 },
  opt: { textAlign: "left", display: "flex", flexDirection: "column", gap: 3, border: "1px solid #e6e3db", borderRadius: 10, padding: "9px 11px", background: "#fcfbf8", cursor: "pointer", font: "inherit" },
  optPicked: { borderColor: "#2f7d76", background: "#eef6f4" },
  optQ: { fontSize: 14, fontWeight: 600, color: "#1c1c1e" },
  optA: { fontSize: 12.5, color: "#6f6b63" },
  toggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
  phr: { marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  prow: { display: "flex", alignItems: "center", gap: 8 },
  tag: { flex: "0 0 auto", width: 22, height: 22, borderRadius: 6, background: "#e7efed", color: "#1c4a45", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 18, fontWeight: 700 },
  add: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 16, flexWrap: "wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
};
