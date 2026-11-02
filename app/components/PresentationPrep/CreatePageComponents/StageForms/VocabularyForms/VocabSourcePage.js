"use client";
// VocabSourcePage.js
// Step 1 of the Vocabulary skill flow — the Source page (the generalized
// "add source material" step, like Listening's). Captures the book reference
// (persisted via useVocabStore). Screenshot upload + OCR into the lesson's
// vocabulary is the NEXT increment; the dropzones are placeholders for now.

import { useVocabStore } from "@app/stores/useVocabStore";

export default function VocabSourcePage() {
  const vocabInputs = useVocabStore((s) => s.vocabInputs) ?? {};
  const updateVocabInputs = useVocabStore((s) => s.updateVocabInputs);
  const bind = (key) => (e) => updateVocabInputs({ [key]: e.target.value });

  return (
    <div style={st.wrap}>
      <div style={st.head}>
        <div style={st.eyebrow}>Vocabulary · step 1 of 3</div>
        <h2 style={st.h2}>Add your source material</h2>
        <p style={st.sub}>
          Note the book, then add screenshots of your vocabulary. This lives once
          per lesson and every stage shares it.
        </p>
      </div>

      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>1</span>
          <h3 style={st.h3}>Book reference</h3>
        </div>
        <div style={st.formrow}>
          <label style={st.label}>
            Book
            <input style={st.input} value={vocabInputs.book || ""} onChange={bind("book")} placeholder="e.g. Think 3 (2nd ed.)" />
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

      <div style={st.card}>
        <div style={st.chead}>
          <span style={st.num}>2</span>
          <h3 style={st.h3}>Screenshots</h3>
          <span style={st.creq}>questions &amp; answers</span>
        </div>
        <div style={st.drops}>
          <div style={st.drop}>Drag the <b>questions</b> screenshot, or click to add</div>
          <div style={st.drop}>Drag the <b>answers</b> screenshot</div>
        </div>
        <div style={st.note}>
          Screenshot upload + OCR into the lesson's vocabulary is the next step. For
          now the book reference saves; add Hot Seat / warm-ups on the next page.
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
  drops: { display: "flex", gap: "12px", flexWrap: "wrap" },
  drop: { flex: 1, minWidth: "200px", border: "1.5px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: "12px", padding: "24px 16px", fontSize: "14px", textAlign: "center" },
  note: { fontSize: "13px", color: "#b8b3a8", fontStyle: "italic", marginTop: "12px", lineHeight: 1.5 },
};
