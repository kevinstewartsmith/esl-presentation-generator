"use client";
// VocabSourcePage.js
// Step 1 of the Vocabulary skill flow — the Source page. Captures the book
// reference (useVocabStore.vocabInputs) and lets the teacher drop QUESTION /
// ANSWER screenshots of the coursebook vocabulary. Uploads reuse the shared
// AddTextBook component (IndexedDB preview + Firestore persist — the same path
// listening/reading use), with autoExtract={false} so AddTextBook's own
// textbook OCR does NOT run here. Instead, when a screenshot lands we read it
// back from IndexedDB and send it to Gemini (/api/extract-vocab-from-image),
// producing a teacher-editable word list (useVocabStore.screenshotWords) that
// feeds Hot Seat's vocab-screenshots source.

import { useEffect, useRef, useState } from "react";
import { useVocabStore } from "@app/stores/useVocabStore";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import { vocabularyStage } from "@app/utils/SectionIDs";
import { getFile } from "@app/utils/indexedDBWrapper";

const CATS = [
  { key: "vocabQuestions", label: "Questions" },
  { key: "vocabAnswers", label: "Answers" },
];

function blobToDataURL(blob) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => resolve(null);
    r.readAsDataURL(blob);
  });
}

export default function VocabSourcePage() {
  const vocabInputs = useVocabStore((s) => s.vocabInputs) ?? {};
  const updateVocabInputs = useVocabStore((s) => s.updateVocabInputs);
  const imagePathsByCategory =
    useVocabStore((s) => s.imagePathsByCategory) ?? {};
  const screenshotWords = useVocabStore((s) => s.screenshotWords) ?? [];
  const setScreenshotWords = useVocabStore((s) => s.setScreenshotWords);

  const bind = (key) => (e) => updateVocabInputs({ [key]: e.target.value });

  const [extracting, setExtracting] = useState(false);
  const [newWord, setNewWord] = useState("");
  const seenRef = useRef({});

  // When a NEW screenshot lands (not a hydration), read it back from IndexedDB
  // and send it to Gemini for vocab extraction; merge the words in.
  useEffect(() => {
    const paths = imagePathsByCategory || {};
    if (useVocabStore.getState().justHydratedImagePaths) {
      seenRef.current = { ...paths }; // adopt existing on load, don't re-extract
      return;
    }
    Object.entries(paths).forEach(([cat, path]) => {
      if (path && path !== seenRef.current[cat]) {
        seenRef.current[cat] = path;
        extractFrom(path);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePathsByCategory]);

  async function extractFrom(path) {
    try {
      setExtracting(true);
      const data = await getFile(path);
      let image = null;
      if (typeof data === "string" && data.startsWith("data:image")) {
        image = data;
      } else if (data instanceof Blob) {
        image = await blobToDataURL(data);
      }
      if (!image) return;

      const res = await fetch("/api/extract-vocab-from-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const { words = [] } = await res.json();
      if (Array.isArray(words) && words.length) {
        const prev = useVocabStore.getState().screenshotWords || [];
        setScreenshotWords([...new Set([...prev, ...words])]);
      }
    } catch (e) {
      console.error("vocab extract failed", e);
    } finally {
      setExtracting(false);
    }
  }

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
          Note the book, then drop screenshots of the vocabulary. The words are
          read out of the screenshots automatically — fix anything that looks
          off. This lives once per lesson and every stage shares it.
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
            <input style={st.input} value={vocabInputs.unit || ""} onChange={bind("unit")} />
          </label>
          <label style={{ ...st.label, ...st.sm }}>
            Page
            <input style={st.input} value={vocabInputs.page || ""} onChange={bind("page")} />
          </label>
          <label style={{ ...st.label, ...st.sm }}>
            Exercise
            <input style={st.input} value={vocabInputs.exercise || ""} onChange={bind("exercise")} />
          </label>
        </div>
      </div>

      {/* 2 — screenshots (reuse AddTextBook; no built-in OCR) */}
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
              <AddTextBook
                category={c.key}
                stageID={vocabularyStage}
                autoExtract={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3 — extracted, editable vocabulary */}
      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>3</span>
          <h3 style={st.h3}>Vocabulary found</h3>
          {extracting && <span style={st.creq}>reading screenshots…</span>}
        </div>
        {screenshotWords.length === 0 ? (
          <div style={st.empty}>
            Drop a screenshot above and the words appear here, ready to edit.
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
  wrap: { maxWidth: "min(1216px, calc(100vw - 240px))", margin: "0 auto", padding: "8px 4px 48px" },
  head: { marginBottom: "18px" },
  eyebrow: { fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#2f7d76", fontWeight: 700 },
  h2: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "26px", fontWeight: 600, color: "#1c1c1e", margin: "6px 0 0" },
  sub: { color: "#44423d", lineHeight: 1.5, maxWidth: "62ch", margin: "7px 0 0", fontSize: "14.5px" },
  card: { background: "#fff", border: "1px solid #e6e3db", borderRadius: "16px", padding: "18px", marginBottom: "16px" },
  chead: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  num: { width: "26px", height: "26px", borderRadius: "8px", background: "#2f7d76", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "13px", flex: "0 0 auto" },
  h3: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "16px", fontWeight: 600, flex: 1, margin: 0 },
  creq: { fontSize: "12px", color: "#6f6b63" },
  formrow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  label: { display: "flex", flexDirection: "column", gap: "5px", fontSize: "12.5px", color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: "160px" },
  sm: { flex: "0 0 110px", minWidth: "90px" },
  input: { border: "1px solid #e6e3db", borderRadius: "9px", padding: "9px 11px", fontSize: "14.5px", color: "#1c1c1e", background: "#fff", font: "inherit" },
  drops: { display: "flex", gap: "16px", flexWrap: "wrap" },
  dropCol: { flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "8px" },
  dropLabel: { fontSize: "12.5px", fontWeight: 700, color: "#6f6b63" },
  empty: { fontSize: "13.5px", color: "#b8b3a8", fontStyle: "italic", padding: "6px 0 12px" },
  chips: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" },
  chip: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#f1f7f6", border: "1px solid #cfe3e0", color: "#1c4a45", borderRadius: "999px", padding: "5px 10px 5px 12px", fontSize: "13.5px", fontWeight: 600 },
  chipX: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: 0, fontWeight: 700 },
  addRow: { display: "flex", gap: "8px", maxWidth: "340px" },
  addInput: { flex: 1, border: "1px solid #e6e3db", borderRadius: "9px", padding: "8px 11px", fontSize: "14px", color: "#1c1c1e", background: "#fff", font: "inherit" },
  addBtn: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: "9px", padding: "8px 16px", fontSize: "14px", fontWeight: 600, cursor: "pointer", font: "inherit" },
};
