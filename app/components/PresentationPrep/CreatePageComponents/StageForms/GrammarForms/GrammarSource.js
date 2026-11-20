"use client";
// GrammarSource.js — page 1 of the Grammar skill (Running Dictation).
// Upload a grammar exercise screenshot (reuses the shared AddTextBook via the
// "GrammarExerciseText" category -> useGrammarStore.grammarContent), plus the
// lesson details. The target grammar is detected and the dictation is built on
// the next page (GrammarBuild).
//
// NOTE: MVP uses ONE exercise upload. The repeatable, auto-appending multi-
// exercise uploader is a planned follow-up.

import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import { grammarRunningDictationStage } from "@app/utils/SectionIDs";
import { useGrammarStore } from "@app/stores/useGrammarStore";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function preview(content) {
  if (!content) return "";
  try {
    const o = JSON.parse(content);
    if (o && typeof o === "object") {
      if (Array.isArray(o.questions)) return o.questions.map((q) => `${q.number ?? ""} ${q.text ?? ""}`.trim()).join("\n");
      if (typeof o.text === "string") return o.text;
      return JSON.stringify(o, null, 2);
    }
  } catch {}
  return String(content);
}

export default function GrammarSource() {
  const inputTexts = useGrammarStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useGrammarStore((s) => s.updateInputTextForKey);
  const grammarContent = useGrammarStore((s) => s.grammarContent);
  const t = inputTexts || {};

  return (
    <div style={st.page}>
      <h2 style={st.h2}>Grammar — source</h2>
      <p style={st.sub}>Upload a grammar exercise and add the lesson details. On the next page we detect the target grammar and build the running-dictation strips.</p>

      <div style={st.grid}>
        <label style={st.lbl}>Lesson name
          <input style={st.in} value={t.lessonName || ""} onChange={(e) => updateInputTextForKey("lessonName", e.target.value)} placeholder="e.g. Unit 7 — Past Perfect" />
        </label>
        <label style={{ ...st.lbl, flex: "0 0 120px" }}>Level
          <select style={st.in} value={t.level || "B1"} onChange={(e) => updateInputTextForKey("level", e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>
      <div style={st.grid}>
        <label style={st.lbl}>Topic (optional)
          <input style={st.in} value={t.topic || ""} onChange={(e) => updateInputTextForKey("topic", e.target.value)} placeholder="e.g. travel, daily life" />
        </label>
        <label style={st.lbl}>Target grammar (auto-detected on next page; override here if you like)
          <input style={st.in} value={t.grammarPoint || ""} onChange={(e) => updateInputTextForKey("grammarPoint", e.target.value)} placeholder="e.g. Past perfect" />
        </label>
      </div>

      <div style={st.uploadWrap}>
        <AddTextBook category="GrammarExerciseText" stageID={grammarRunningDictationStage} />
      </div>

      {grammarContent ? (
        <div style={st.previewBox}>
          <div style={st.previewLabel}>Extracted exercise</div>
          <pre style={st.previewText}>{preview(grammarContent)}</pre>
        </div>
      ) : (
        <p style={st.note}>Drop a grammar exercise screenshot above — the text is extracted automatically.</p>
      )}
    </div>
  );
}

const st = {
  page: { maxWidth: 900, margin: "0 auto", padding: "8px 16px 40px" },
  h2: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, color: "#1c1c1e", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6f6b63", margin: "0 0 16px", maxWidth: 620 },
  grid: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 180 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  uploadWrap: { margin: "8px 0 16px" },
  previewBox: { border: "1px solid #f0eee8", borderRadius: 12, background: "#fbfaf7", padding: 14 },
  previewLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", marginBottom: 6 },
  previewText: { margin: 0, fontSize: 13.5, color: "#2b2b2b", whiteSpace: "pre-wrap", fontFamily: "inherit" },
  note: { fontSize: 14, color: "#8a857a", fontStyle: "italic" },
};
