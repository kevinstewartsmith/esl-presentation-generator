"use client";
// DetailReadingCard.js — Configure card for the "Reading for detail" stage.
// Content (questions, answers, evidence passages, explanations) is built and
// edited on the "Review & build" page — this card is the PRESENTATION surface:
// a compact read-only preview of each item plus the choices that shape the
// deck: per-question "Review", the slide modes, the whole-text passage, the
// embedded partner-check, and time. All reads from the structured readingItems;
// review + modes persist in detailConfig; partner/time in this stage's config.

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";
import { wholeTextString, textParagraphs, paragraphOf } from "@app/components/FinalPresentationSections/readingDetailModel";
import { getDetailModes, getQuestionFlags } from "@app/components/FinalPresentationSections/detailConfigHelpers";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CONFIG_DEFAULTS = { timeMinutes: 8, showTimer: true, checkOn: false, checkPhrases: DEFAULT_PHRASES };

export default function DetailReadingCard({ item, position }) {
  const stageId = item.id;
  const config = useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore((s) => s.updateStageActivityConfig);

  const detailConfig = useAudioTextStore((s) => s.detailConfig);
  const updateDetailMode = useAudioTextStore((s) => s.updateDetailMode);
  const updateDetailPerQuestion = useAudioTextStore((s) => s.updateDetailPerQuestion);

  const inputTexts = useReadingStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useReadingStore((s) => s.updateInputTextForKey);
  const readingItems = useReadingStore((s) => s.readingItems) ?? [];
  const textbook = useReadingStore((s) => s.textbook);

  useEffect(() => {
    if (!useAudioTextStore.getState().stageActivities?.[stageId]?.config) {
      updateStageActivityConfig(stageId, CONFIG_DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const setCfg = (patch) => updateStageActivityConfig(stageId, patch);
  const c = { ...CONFIG_DEFAULTS, ...config };
  const t = inputTexts || {};
  const phrases = Array.isArray(c.checkPhrases) ? c.checkPhrases : DEFAULT_PHRASES;
  const modes = getDetailModes(detailConfig);
  const showPassage = detailConfig?.showPassage ?? true;
  const wholeText = wholeTextString(textbook);
  const hasText = !!wholeText.trim();
  const paragraphs = textParagraphs(wholeText);

  const setPhrase = (i, v) => { const n = [...phrases]; n[i] = v; setCfg({ checkPhrases: n }); };
  const addPhrase = () => setCfg({ checkPhrases: [...phrases, ""] });
  const removePhrase = (i) => setCfg({ checkPhrases: phrases.filter((_, j) => j !== i) });

  const pText = (it) => (Array.isArray(it.passages) ? it.passages : []).map((p) => (typeof p === "string" ? p : p?.text || "")).filter(Boolean);
  const hasItems = readingItems.length > 0;
  const count = readingItems.length;

  return (
    <CardShell position={position} label="Reading for detail" right={hasItems ? `${count} question${count === 1 ? "" : "s"}` : undefined}>
      <div style={st.hint}>Book reference is shared with your source — editing here updates it everywhere.</div>
      <label style={st.lbl}>
        Text title
        <input style={st.in} value={t.title || ""} onChange={(e) => updateInputTextForKey("title", e.target.value)} placeholder="e.g. A day in Hanoi" />
      </label>
      <div style={st.grid}>
        <label style={{ ...st.lbl, ...st.sm }}>
          Exercise page
          <input style={st.in} value={t.exercisePage || ""} onChange={(e) => updateInputTextForKey("exercisePage", e.target.value)} />
        </label>
        <label style={st.lbl}>
          Exercise(s)
          <input style={st.in} value={t.exercise || ""} onChange={(e) => updateInputTextForKey("exercise", e.target.value)} placeholder="e.g. 2 and 3" />
        </label>
      </div>

      <div style={st.secHead}>Questions &amp; answers</div>
      {!hasItems && <p style={st.note}>Build them on the <strong>Review &amp; build</strong> page first — then choose which to review here.</p>}
      {hasItems && (
        <div style={st.list}>
          {readingItems.map((it, index) => {
            const flags = getQuestionFlags(detailConfig, index);
            const passages = pText(it);
            return (
              <div key={`${it.number}-${index}`} style={{ ...st.block, opacity: flags.review ? 1 : 0.5 }}>
                <div style={st.qRow}>
                  <span style={st.qNum}>{it.number}</span>
                  <span style={st.question}>{it.question}</span>
                  {it.cefr?.level && <span style={st.cefr} title={it.cefr.reason || ""}>{it.cefr.level}</span>}
                </div>
                <div style={st.aRow}><span style={st.tag}>Answer</span><span style={st.answer}>{it.answer || <em style={st.faint}>—</em>}</span></div>
                {passages.length > 0 && <div style={st.pv}><span style={st.tag}>Evidence</span><span style={st.pvText}>{passages.map((p) => { const n = paragraphOf(p, paragraphs); return n ? `¶${n} ${p}` : p; }).join("  ·  ")}</span></div>}
                <label style={st.revToggle}>
                  <input type="checkbox" checked={flags.review} onChange={(e) => updateDetailPerQuestion(index, "review", e.target.checked)} />
                  Review this answer
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div style={st.secHead}>How to present answers</div>
      <div style={st.modes}>
        <label style={st.modeRow}>
          <input type="checkbox" checked={modes.showSlideBySlide} onChange={(e) => updateDetailMode("showSlideBySlide", e.target.checked)} />
          <div><div style={st.modeTitle}>Go over slide by slide</div><div style={st.modeSub}>One question per slide: answer, evidence, then why — revealed on click</div></div>
        </label>
        <label style={st.modeRow}>
          <input type="checkbox" checked={modes.showAllOnOneSlide} onChange={(e) => updateDetailMode("showAllOnOneSlide", e.target.checked)} />
          <div><div style={st.modeTitle}>Show all answers on one slide</div><div style={st.modeSub}>A single recap slide with every answer</div></div>
        </label>
        <label style={st.modeRow}>
          <input type="checkbox" checked={showPassage} onChange={(e) => updateDetailMode("showPassage", e.target.checked)} />
          <div><div style={st.modeTitle}>Show the whole text on screen</div><div style={st.modeSub}>{hasText ? "Full passage slide(s) from your text screenshot" : "Add a reading-text screenshot on the Source page"}</div></div>
        </label>
      </div>

      <div style={st.section}>
        <label style={st.toggle}>
          <input type="checkbox" checked={!!c.checkOn} onChange={(e) => setCfg({ checkOn: e.target.checked })} />
          Partner check before answers
        </label>
        {c.checkOn && (
          <div style={st.phr}>
            {phrases.map((p, i) => (
              <div key={i} style={st.prow}>
                <span style={st.ptag}>{i % 2 === 0 ? "A" : "B"}</span>
                <input style={st.in} value={p} onChange={(e) => setPhrase(i, e.target.value)} />
                <button style={st.x} onClick={() => removePhrase(i)} aria-label="Remove">×</button>
              </div>
            ))}
            <button style={st.addSm} onClick={addPhrase}>+ Add line</button>
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
          Show time limit on the slide
        </label>
      </div>
    </CardShell>
  );
}

const st = {
  hint: { fontSize: 12, color: "#8a857a", fontStyle: "italic", marginBottom: 12 },
  note: { fontSize: 14, color: "#6f6b63", margin: "4px 0 0" },
  grid: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 16, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 120px", minWidth: 100 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit", flex: 1 },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
  secHead: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", margin: "18px 0 8px" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  block: { padding: 12, border: "1px solid #f0eee8", borderRadius: 10, background: "#fbfaf7", transition: "opacity 0.15s ease" },
  qRow: { display: "flex", gap: 8, alignItems: "baseline" },
  qNum: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#2f7d76", flexShrink: 0 },
  question: { fontWeight: 600, fontSize: 15.5, flex: 1, color: "#1c1c1e" },
  cefr: { flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#185fa5", background: "#e6f1fb", padding: "2px 7px", borderRadius: 20 },
  aRow: { display: "flex", gap: 6, alignItems: "baseline", marginTop: 5 },
  tag: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", flexShrink: 0 },
  answer: { fontSize: 14.5, color: "#3a3a3a", flex: 1 },
  faint: { color: "#b8b3a8" },
  pv: { display: "flex", gap: 6, alignItems: "baseline", marginTop: 4 },
  pvText: { fontSize: 13, color: "#6f6b63", fontStyle: "italic", flex: 1 },
  revToggle: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6f6b63", cursor: "pointer", marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0eee8" },
  modes: { display: "flex", flexDirection: "column", gap: 8 },
  modeRow: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid #f0eee8", borderRadius: 10, background: "#fbfaf7", cursor: "pointer" },
  modeTitle: { fontSize: 15 },
  modeSub: { fontSize: 13, color: "#8a857c" },
  section: { marginTop: 18, paddingTop: 14, borderTop: "1px solid #eee7da" },
  toggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
  phr: { marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  prow: { display: "flex", alignItems: "center", gap: 8 },
  ptag: { flex: "0 0 auto", width: 22, height: 22, borderRadius: 6, background: "#e7efed", color: "#1c4a45", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 18, fontWeight: 700, lineHeight: 1, paddingTop: 4 },
  addSm: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "5px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" },
};
