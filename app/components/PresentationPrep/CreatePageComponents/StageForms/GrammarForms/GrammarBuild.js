"use client";
// GrammarBuild.js — page 2 of the Grammar skill (Running Dictation).
// 1) Detect/edit the lesson AIMS from the exercise (generic /api/generate-aims).
// 2) Generate/edit the running-dictation SENTENCES (generic
//    /api/generate-dictation-sentences), each with a bolded target.
// 3) Download the cut-strips PDF (shared ContentTools pipeline).

import { useState } from "react";
import { useGrammarStore, grammarExercisesToText } from "@app/stores/useGrammarStore";
import DownloadStripsButton from "@app/components/ContentTools/DownloadStripsButton";

function sanitize(s) {
  return String(s || "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
}

export default function GrammarBuild() {
  const exercises = useGrammarStore((s) => s.grammarExercises) ?? [];
  const inputTexts = useGrammarStore((s) => s.inputTexts) ?? {};
  const aims = useGrammarStore((s) => s.aims) ?? [];
  const setAims = useGrammarStore((s) => s.setAims);
  const updateAim = useGrammarStore((s) => s.updateAim);
  const addAim = useGrammarStore((s) => s.addAim);
  const removeAim = useGrammarStore((s) => s.removeAim);
  const sentences = useGrammarStore((s) => s.dictationSentences) ?? [];
  const setDictationSentences = useGrammarStore((s) => s.setDictationSentences);
  const updateDictationSentence = useGrammarStore((s) => s.updateDictationSentence);
  const removeDictationSentence = useGrammarStore((s) => s.removeDictationSentence);

  const [aimsBusy, setAimsBusy] = useState(false);
  const [senBusy, setSenBusy] = useState(false);
  const [err, setErr] = useState("");

  const level = inputTexts.level || "B1";
  const content = grammarExercisesToText(exercises);
  const hasContent = !!content.trim();
  const title = inputTexts.grammarPoint || inputTexts.lessonName || "Running Dictation";
  const fileName = `Running Dictation${inputTexts.lessonName ? " — " + sanitize(inputTexts.lessonName) : ""}.pdf`;

  const detectAims = async () => {
    if (!hasContent) { setErr("Upload a grammar exercise on the Source page first."); return; }
    setErr(""); setAimsBusy(true);
    try {
      const res = await fetch("/api/generate-aims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, skill: "grammar", level }),
      });
      if (!res.ok) { setErr(`Aims: HTTP ${res.status}`); return; }
      const data = await res.json();
      setAims(Array.isArray(data.aims) ? data.aims : []);
    } catch (e) { console.error(e); setErr("Couldn't detect aims."); }
    finally { setAimsBusy(false); }
  };

  const generateSentences = async () => {
    if (!hasContent && aims.length === 0) { setErr("Detect aims or upload an exercise first."); return; }
    setErr(""); setSenBusy(true);
    try {
      const res = await fetch("/api/generate-dictation-sentences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          skill: "grammar",
          level,
          count: 10,
          targets: aims.length ? aims : undefined,
        }),
      });
      if (!res.ok) { setErr(`Sentences: HTTP ${res.status}`); return; }
      const data = await res.json();
      setDictationSentences(Array.isArray(data.sentences) ? data.sentences : []);
    } catch (e) { console.error(e); setErr("Couldn't generate sentences."); }
    finally { setSenBusy(false); }
  };

  return (
    <div style={st.page}>
      <h2 style={st.h2}>Grammar — build</h2>
      <p style={st.sub}>Detect the aims, generate the running-dictation sentences, then download the cut-strips PDF.</p>
      {err && <div style={st.err}>{err}</div>}

      {/* Aims */}
      <div style={st.sec}>
        <div style={st.secHead}>
          <span style={st.secTitle}>Aims / target language</span>
          <button style={st.gen} onClick={detectAims} disabled={aimsBusy || !hasContent}>{aimsBusy ? "Detecting…" : aims.length ? "Re-detect" : "✦ Detect aims"}</button>
        </div>
        {aims.length === 0 && <p style={st.note}>Detect the target grammar and aims from your exercise.</p>}
        {aims.map((a, i) => (
          <div key={i} style={st.row}>
            <span style={st.dot}>•</span>
            <textarea rows={1} style={st.area} value={a} onChange={(e) => updateAim(i, e.target.value)} />
            <button style={st.x} onClick={() => removeAim(i)} aria-label="Remove">×</button>
          </div>
        ))}
        {aims.length > 0 && <button style={st.addSm} onClick={addAim}>+ Add aim</button>}
      </div>

      {/* Sentences */}
      <div style={st.sec}>
        <div style={st.secHead}>
          <span style={st.secTitle}>Running-dictation sentences</span>
          <button style={st.gen} onClick={generateSentences} disabled={senBusy || (!hasContent && !aims.length)}>{senBusy ? "Generating…" : sentences.length ? "Regenerate" : "✦ Generate sentences"}</button>
        </div>
        {sentences.length === 0 && <p style={st.note}>Each sentence shows the target grammar with one word/phrase bolded on the strip.</p>}
        {sentences.map((s, i) => (
          <div key={i} style={st.sentBlock}>
            <div style={st.row}>
              <span style={st.num}>{i + 1}</span>
              <textarea rows={1} style={st.area} value={s.sentence || ""} onChange={(e) => updateDictationSentence(i, { sentence: e.target.value })} />
              <button style={st.x} onClick={() => removeDictationSentence(i)} aria-label="Remove">×</button>
            </div>
            <div style={st.targetRow}>
              <span style={st.tag}>Bold</span>
              <input style={st.targetIn} value={s.target || ""} onChange={(e) => updateDictationSentence(i, { target: e.target.value })} placeholder="exact words to embolden" />
              {s.target && !(s.sentence || "").includes(s.target) ? <span style={st.warn}>not found in sentence</span> : null}
            </div>
          </div>
        ))}
      </div>

      {/* Download */}
      <div style={st.downloadBar}>
        <DownloadStripsButton sentences={sentences} title={title} fileName={fileName} style={st.download}>
          ⬇ Download cut-strips PDF
        </DownloadStripsButton>
        {sentences.length > 0 && <span style={st.fileHint}>{fileName}</span>}
      </div>
    </div>
  );
}

const st = {
  page: { maxWidth: 900, margin: "0 auto", padding: "8px 16px 60px" },
  h2: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, color: "#1c1c1e", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6f6b63", margin: "0 0 16px", maxWidth: 620 },
  err: { fontSize: 13.5, color: "#b4532f", background: "#fbeee9", border: "1px solid #f0d6cc", borderRadius: 9, padding: "8px 11px", marginBottom: 12 },
  sec: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee7da" },
  secHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8, flexWrap: "wrap" },
  secTitle: { fontSize: 15, fontWeight: 700, color: "#44423d" },
  gen: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 9, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit" },
  note: { fontSize: 13.5, color: "#8a857a", fontStyle: "italic", margin: "0 0 8px" },
  row: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 },
  dot: { fontSize: 18, color: "#2f7d76", lineHeight: 1.4 },
  num: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 600, color: "#2f7d76", minWidth: 18, textAlign: "right", paddingTop: 6 },
  area: { flex: 1, border: "1px solid #e6e3db", borderRadius: 9, padding: "8px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit", resize: "vertical", lineHeight: 1.4 },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 20, fontWeight: 700, lineHeight: 1, paddingTop: 4 },
  addSm: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "6px 11px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  sentBlock: { padding: "10px 10px 6px", border: "1px solid #f0eee8", borderRadius: 10, background: "#fbfaf7", marginBottom: 10 },
  targetRow: { display: "flex", gap: 8, alignItems: "center", paddingLeft: 26, marginTop: 2 },
  tag: { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c" },
  targetIn: { flex: "0 1 320px", border: "1px solid #e6e3db", borderRadius: 8, padding: "6px 9px", fontSize: 13.5, color: "#2b2b2b", background: "#fff", font: "inherit", fontWeight: 700 },
  warn: { fontSize: 12.5, color: "#b4532f" },
  downloadBar: { marginTop: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  download: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 10, padding: "11px 18px", fontSize: 15, fontWeight: 600, cursor: "pointer", font: "inherit" },
  fileHint: { fontSize: 13, color: "#8a857a" },
};
