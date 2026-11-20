"use client";
// GrammarSource.js — page 1 of the Grammar skill (Running Dictation).
// Repeatable, auto-appending exercise blocks: each exercise = a QUESTION
// screenshot + an ANSWER screenshot (shared AddTextBook, routed per-slot via
// onExtracted into useGrammarStore.grammarExercises[i]). A fresh empty block
// appears after the last filled one. "✦ Detect target grammar" reads all
// exercises and fills the target-grammar label + aims.
//
// Image thumbnails key off the slot index; removing a middle exercise can leave
// a thumbnail mis-aligned, but the extracted TEXT (source of truth) always
// follows the array. (Stable per-exercise ids are a later refinement.)

import { useState } from "react";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import { grammarRunningDictationStage } from "@app/utils/SectionIDs";
import { useGrammarStore, grammarExercisesToText } from "@app/stores/useGrammarStore";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function previewText(v) {
  if (!v) return "";
  try {
    const o = JSON.parse(v);
    if (o && typeof o === "object") {
      if (Array.isArray(o.questions)) return o.questions.map((q) => `${q.number ?? ""} ${q.text ?? ""}`.trim()).join("\n");
      if (Array.isArray(o.answers)) return o.answers.map((a) => `${a.number ?? ""} ${a.answer ?? ""}`.trim()).join("\n");
      if (typeof o.text === "string") return o.text;
      return JSON.stringify(o, null, 2);
    }
  } catch {}
  return String(v);
}

function Slot({ label, dropLabel, category, extractCategory, onExtracted, value }) {
  return (
    <div style={st.slot}>
      <div style={st.slotLabel}>{label}</div>
      <AddTextBook
        category={category}
        extractCategory={extractCategory}
        stageID={grammarRunningDictationStage}
        onExtracted={onExtracted}
        dropLabel={dropLabel}
      />
      {value ? <pre style={st.preview}>{previewText(value)}</pre> : null}
    </div>
  );
}

function ExerciseBlock({ index, exercise, onField, onRemove, isNew }) {
  return (
    <div style={st.exercise}>
      <div style={st.exHead}>
        <span style={st.exTitle}>{isNew ? "New exercise" : `Exercise ${index + 1}`}</span>
        {!isNew && onRemove ? (
          <button style={st.remove} onClick={onRemove}>Remove</button>
        ) : null}
      </div>
      <Slot
        label="Questions screenshot"
        dropLabel="a questions image"
        category={`GrammarEx${index}Q`}
        extractCategory="QuestionText"
        onExtracted={(t) => onField(index, "questions", t)}
        value={exercise?.questions}
      />
      <Slot
        label="Answers screenshot"
        dropLabel="an answers image"
        category={`GrammarEx${index}A`}
        extractCategory="AnswerText"
        onExtracted={(t) => onField(index, "answers", t)}
        value={exercise?.answers}
      />
    </div>
  );
}

export default function GrammarSource() {
  const inputTexts = useGrammarStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useGrammarStore((s) => s.updateInputTextForKey);
  const exercises = useGrammarStore((s) => s.grammarExercises) ?? [];
  const updateGrammarExerciseField = useGrammarStore((s) => s.updateGrammarExerciseField);
  const removeGrammarExercise = useGrammarStore((s) => s.removeGrammarExercise);
  const setAims = useGrammarStore((s) => s.setAims);

  const [detecting, setDetecting] = useState(false);
  const [err, setErr] = useState("");
  const t = inputTexts || {};

  // Index-based write for every block, including the trailing "new" one.
  // updateGrammarExerciseField pads the array up to `index`, so writing to the
  // trailing index creates that exercise — and writing twice to the same index
  // overwrites instead of appending (no duplicate exercises).
  const setField = (index, field, text) => {
    // Don't materialize a brand-new trailing exercise from an empty/cleared
    // extraction; only real content creates the next slot.
    if (!text && index >= exercises.length) return;
    updateGrammarExerciseField(index, field, text);
  };

  const hasContent = exercises.some((ex) => ex?.questions || ex?.answers);

  const detect = async () => {
    const content = grammarExercisesToText(exercises);
    if (!content.trim()) { setErr("Upload at least one exercise first."); return; }
    setErr(""); setDetecting(true);
    try {
      const res = await fetch("/api/generate-aims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, skill: "grammar", level: t.level || "B1" }),
      });
      if (!res.ok) { setErr(`Detect: HTTP ${res.status}`); return; }
      const data = await res.json();
      if (data.target) updateInputTextForKey("grammarPoint", data.target);
      if (Array.isArray(data.aims)) setAims(data.aims);
    } catch (e) { console.error(e); setErr("Couldn't detect the target grammar."); }
    finally { setDetecting(false); }
  };

  return (
    <div style={st.page}>
      <h2 style={st.h2}>Grammar — source</h2>
      <p style={st.sub}>Add the grammar exercises from the book (a Questions screenshot and an Answers screenshot each). A new block appears as you go. Then detect the target grammar.</p>

      <div style={st.grid}>
        <label style={st.lbl}>Lesson name
          <input style={st.in} value={t.lessonName || ""} onChange={(e) => updateInputTextForKey("lessonName", e.target.value)} placeholder="e.g. Unit 7 — Past Perfect" />
        </label>
        <label style={{ ...st.lbl, flex: "0 0 110px" }}>Level
          <select style={st.in} value={t.level || "B1"} onChange={(e) => updateInputTextForKey("level", e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>
      <div style={st.grid}>
        <label style={st.lbl}>Topic (optional)
          <input style={st.in} value={t.topic || ""} onChange={(e) => updateInputTextForKey("topic", e.target.value)} placeholder="e.g. travel, daily life" />
        </label>
        <label style={st.lbl}>Target grammar
          <div style={st.detectRow}>
            <input style={{ ...st.in, flex: 1 }} value={t.grammarPoint || ""} onChange={(e) => updateInputTextForKey("grammarPoint", e.target.value)} placeholder="auto-detected, editable" />
            <button style={st.detect} onClick={detect} disabled={detecting || !hasContent}>{detecting ? "Detecting…" : "✦ Detect"}</button>
          </div>
        </label>
      </div>
      {err && <div style={st.err}>{err}</div>}

      <div style={st.exercises}>
        {exercises.map((ex, i) => (
          <ExerciseBlock
            key={i}
            index={i}
            exercise={ex}
            onField={setField}
            onRemove={() => removeGrammarExercise(i)}
          />
        ))}
        {/* auto-appending trailing block */}
        <ExerciseBlock
          key={`new-${exercises.length}`}
          index={exercises.length}
          exercise={{}}
          onField={setField}
          isNew
        />
      </div>
    </div>
  );
}

const st = {
  page: { maxWidth: 1000, margin: "0 auto", padding: "8px 16px 60px" },
  h2: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, color: "#1c1c1e", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6f6b63", margin: "0 0 16px", maxWidth: 680 },
  grid: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 180 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  detectRow: { display: "flex", gap: 8, alignItems: "center" },
  detect: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 9, padding: "9px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit", whiteSpace: "nowrap" },
  err: { fontSize: 13.5, color: "#b4532f", background: "#fbeee9", border: "1px solid #f0d6cc", borderRadius: 9, padding: "8px 11px", marginBottom: 12 },
  exercises: { display: "flex", flexDirection: "column", gap: 18, marginTop: 10 },
  exercise: { border: "1px solid #ece8df", borderRadius: 14, background: "#fcfbf8", padding: 16 },
  exHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  exTitle: { fontSize: 15, fontWeight: 700, color: "#44423d" },
  remove: { border: "1px solid #e6d5cc", background: "#fff", color: "#b4532f", borderRadius: 8, padding: "4px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  slot: { marginBottom: 12 },
  slotLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", marginBottom: 6 },
  preview: { margin: "8px 0 0", fontSize: 13, color: "#2b2b2b", whiteSpace: "pre-wrap", fontFamily: "inherit", background: "#fff", border: "1px solid #f0eee8", borderRadius: 8, padding: 10 },
};
