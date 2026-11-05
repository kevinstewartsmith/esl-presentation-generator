"use client";
// VocabSourcePage.js
// Step 1 of the Vocabulary skill flow — the Source page. Mirrors listening:
// dropping a QUESTION / ANSWER screenshot runs the shared AddTextBook component
// with extraction ON, so Gemini (/api/extract-textbook via buildTextbookPrompt)
// detects the exercise, CLASSIFIES each item's type, and returns the structured
// exercise PLUS a `targetVocab` list. The parsed exercise is shown below, and
// the target vocab seeds a teacher-editable chip list (useVocabStore.screenshotWords)
// that feeds Hot Seat's vocab-screenshots source.

import { useEffect, useRef, useState } from "react";
import { useVocabStore } from "@app/stores/useVocabStore";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import { vocabularyStage } from "@app/utils/SectionIDs";

const CATS = [
  { key: "vocabQuestions", label: "Questions" },
  { key: "vocabAnswers", label: "Answers" },
];

function safeParse(str) {
  if (!str || typeof str !== "string") return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export default function VocabSourcePage() {
  const vocabInputs = useVocabStore((s) => s.vocabInputs) ?? {};
  const updateVocabInputs = useVocabStore((s) => s.updateVocabInputs);
  const vocabQuestions = useVocabStore((s) => s.vocabQuestions) ?? "";
  const vocabAnswers = useVocabStore((s) => s.vocabAnswers) ?? "";
  const screenshotWords = useVocabStore((s) => s.screenshotWords) ?? [];
  const setScreenshotWords = useVocabStore((s) => s.setScreenshotWords);

  const bind = (key) => (e) => updateVocabInputs({ [key]: e.target.value });

  const [newWord, setNewWord] = useState("");
  const lastQRef = useRef("");

  const parsedQ = safeParse(vocabQuestions);
  const questions = Array.isArray(parsedQ?.questions) ? parsedQ.questions : [];
  const instructions = parsedQ?.instructions || "";
  const parsedA = safeParse(vocabAnswers);
  const answers = Array.isArray(parsedA?.answers) ? parsedA.answers : [];

  // When a NEW questions extraction lands (not a hydration), fold its targetVocab
  // into the editable word list. Only ADDS, so teacher edits are preserved.
  useEffect(() => {
    const vq = vocabQuestions || "";
    if (useVocabStore.getState().justHydratedVocabQuestions) {
      lastQRef.current = vq;
      return;
    }
    if (vq && vq !== lastQRef.current) {
      lastQRef.current = vq;
      const parsed = safeParse(vq);
      const tv = Array.isArray(parsed?.targetVocab) ? parsed.targetVocab : [];
      const clean = tv.map((w) => String(w).trim()).filter(Boolean);
      if (clean.length) {
        const prev = useVocabStore.getState().screenshotWords || [];
        setScreenshotWords([...new Set([...prev, ...clean])]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabQuestions]);

  const removeWord = (w) =>
    setScreenshotWords(screenshotWords.filter((x) => x !== w));
  const addWord = () => {
    const w = newWord.trim();
    if (w && !screenshotWords.includes(w)) {
      setScreenshotWords([...screenshotWords, w]);
    }
    setNewWord("");
  };

  return (
    <div style={st.wrap}>
      <div style={st.head}>
        <div style={st.eyebrow}>Vocabulary · step 1 of 3</div>
        <h2 style={st.h2}>Add your source material</h2>
        <p style={st.sub}>
          Note the book, then drop screenshots of the vocabulary exercise. The
          exercise is read and classified automatically; the target words appear
          below, ready to edit. This lives once per lesson and every stage
          shares it.
        </p>
      </div>

      {/* 1 — book reference */}
      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>1</span>
          <h3 style={st.h3}>Book reference</h3>
        </div>
        <div style={st.formrow}>
          <label style={st.label}>
            Book
            <input
              style={st.input}
              value={vocabInputs.book || ""}
              onChange={bind("book")}
              placeholder="e.g. Think 3 (2nd ed.)"
            />
          </label>
          <label style={{ ...st.label, ...st.sm }}>
            Unit
            <input
              style={st.input}
              value={vocabInputs.unit || ""}
              onChange={bind("unit")}
            />
          </label>
          <label style={{ ...st.label, ...st.sm }}>
            Page
            <input
              style={st.input}
              value={vocabInputs.page || ""}
              onChange={bind("page")}
            />
          </label>
          <label style={{ ...st.label, ...st.sm }}>
            Exercise
            <input
              style={st.input}
              value={vocabInputs.exercise || ""}
              onChange={bind("exercise")}
            />
          </label>
        </div>
      </div>

      {/* 2 — screenshots (extraction ON, same as listening) */}
      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>2</span>
          <h3 style={st.h3}>Screenshots</h3>
          <span style={st.creq}>questions &amp; answers</span>
        </div>
        <div style={st.drops}>
          {CATS.map((c) => (
            <div key={c.key} style={st.dropCol}>
              <div style={st.dropLabel}>{c.label}</div>
              <AddTextBook category={c.key} stageID={vocabularyStage} />
            </div>
          ))}
        </div>
      </div>

      {/* 3 — detected exercise */}
      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>3</span>
          <h3 style={st.h3}>Exercise detected</h3>
          {questions.length > 0 && (
            <span style={st.creq}>
              {questions.length} item{questions.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {questions.length === 0 ? (
          <div style={st.empty}>
            Drop a questions screenshot above — the detected items and their
            types will appear here.
          </div>
        ) : (
          <>
            {instructions ? <div style={st.instr}>{instructions}</div> : null}
            <ol style={st.qlist}>
              {questions.map((q, i) => (
                <li key={i} style={st.qitem}>
                  <span style={st.qnum}>{q.number || i + 1}</span>
                  <div style={st.qbody}>
                    <div style={st.qtext}>
                      {q.text || <em style={st.muted}>(no text)</em>}
                    </div>
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <div style={st.qopts}>{q.options.join(" · ")}</div>
                    )}
                  </div>
                  {q.type ? (
                    <span style={st.typeBadge}>
                      {String(q.type).replace(/_/g, " ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
            {answers.length > 0 && (
              <div style={st.ansRow}>
                <span style={st.ansLabel}>Answer key:</span>{" "}
                {answers.map((a, i) => (
                  <span key={i} style={st.ansChip}>
                    {a.number ? `${a.number}. ` : ""}
                    {a.answer}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4 — target vocabulary (editable) */}
      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>4</span>
          <h3 style={st.h3}>Target vocabulary</h3>
          <span style={st.creq}>feeds Hot Seat</span>
        </div>
        {screenshotWords.length === 0 ? (
          <div style={st.empty}>
            The words this exercise teaches appear here once a screenshot is
            read. Add or remove any.
          </div>
        ) : (
          <div style={st.chips}>
            {screenshotWords.map((w) => (
              <span key={w} style={st.chip}>
                {w}
                <button
                  style={st.chipX}
                  onClick={() => removeWord(w)}
                  title="Remove"
                  aria-label={`Remove ${w}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={st.addRow}>
          <input
            style={st.addInput}
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addWord();
            }}
            placeholder="Add a word…"
          />
          <button style={st.addBtn} onClick={addWord}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

const st = {
  wrap: {
    maxWidth: "min(1216px, calc(100vw - 240px))",
    margin: "0 auto",
    padding: "8px 4px 48px",
  },
  head: { marginBottom: "18px" },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#2f7d76",
    fontWeight: 700,
  },
  h2: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "26px",
    fontWeight: 600,
    color: "#1c1c1e",
    margin: "6px 0 0",
  },
  sub: {
    color: "#44423d",
    lineHeight: 1.5,
    maxWidth: "62ch",
    margin: "7px 0 0",
    fontSize: "14.5px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "16px",
  },
  chead: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  num: {
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    background: "#2f7d76",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: "13px",
    flex: "0 0 auto",
  },
  h3: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "16px",
    fontWeight: 600,
    flex: 1,
    margin: 0,
  },
  creq: { fontSize: "12px", color: "#6f6b63" },
  formrow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "12.5px",
    color: "#6f6b63",
    fontWeight: 600,
    flex: 1,
    minWidth: "160px",
  },
  sm: { flex: "0 0 110px", minWidth: "90px" },
  input: {
    border: "1px solid #e6e3db",
    borderRadius: "9px",
    padding: "9px 11px",
    fontSize: "14.5px",
    color: "#1c1c1e",
    background: "#fff",
    font: "inherit",
  },
  drops: { display: "flex", gap: "16px", flexWrap: "wrap" },
  dropCol: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  dropLabel: { fontSize: "12.5px", fontWeight: 700, color: "#6f6b63" },
  empty: {
    fontSize: "13.5px",
    color: "#b8b3a8",
    fontStyle: "italic",
    padding: "4px 0 8px",
  },
  instr: {
    fontSize: "13.5px",
    color: "#44423d",
    background: "#faf8f3",
    border: "1px solid #eee7da",
    borderRadius: "10px",
    padding: "10px 12px",
    marginBottom: "12px",
  },
  qlist: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  qitem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "10px 12px",
    border: "1px solid #eee7da",
    borderRadius: "10px",
    background: "#fcfbf8",
  },
  qnum: {
    flex: "0 0 auto",
    minWidth: "22px",
    height: "22px",
    borderRadius: "6px",
    background: "#e7efed",
    color: "#1c4a45",
    display: "grid",
    placeItems: "center",
    fontSize: "12px",
    fontWeight: 700,
    marginTop: "1px",
  },
  qbody: { flex: 1, minWidth: 0 },
  qtext: { fontSize: "14px", color: "#1c1c1e", lineHeight: 1.4 },
  qopts: { fontSize: "12.5px", color: "#6f6b63", marginTop: "3px" },
  muted: { color: "#b8b3a8" },
  typeBadge: {
    flex: "0 0 auto",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#2f7d76",
    background: "#eef6f4",
    border: "1px solid #cfe3e0",
    borderRadius: "999px",
    padding: "3px 9px",
    whiteSpace: "nowrap",
  },
  ansRow: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#44423d",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    alignItems: "center",
  },
  ansLabel: { fontWeight: 700, color: "#6f6b63" },
  ansChip: { background: "#f4f1ea", borderRadius: "6px", padding: "2px 8px" },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#f1f7f6",
    border: "1px solid #cfe3e0",
    color: "#1c4a45",
    borderRadius: "999px",
    padding: "5px 10px 5px 12px",
    fontSize: "13.5px",
    fontWeight: 600,
  },
  chipX: {
    border: 0,
    background: "transparent",
    color: "#2f7d76",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
    padding: 0,
    fontWeight: 700,
  },
  addRow: { display: "flex", gap: "8px", maxWidth: "340px" },
  addInput: {
    flex: 1,
    border: "1px solid #e6e3db",
    borderRadius: "9px",
    padding: "8px 11px",
    fontSize: "14px",
    color: "#1c1c1e",
    background: "#fff",
    font: "inherit",
  },
  addBtn: {
    border: "1px solid #2f7d76",
    background: "#2f7d76",
    color: "#fff",
    borderRadius: "9px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    font: "inherit",
  },
};
