"use client";
// TEMPORARY test page — verifies the generate→PDF loop end-to-end in Next.
// Visit /grammar-pdf-test. Safe to delete once the Grammar section is wired.
import { useState } from "react";
import DownloadStripsButton from "@app/components/ContentTools/DownloadStripsButton";

export default function GrammarPdfTest() {
  const [content, setContent] = useState("Past perfect tense: actions before another past action. Reported speech.");
  const [skill, setSkill] = useState("grammar");
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const gen = async () => {
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/generate-dictation-sentences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, skill, level: "B1", count: 8 }),
      });
      if (!res.ok) { setErr(`HTTP ${res.status}`); setLoading(false); return; }
      const data = await res.json();
      setSentences(data.sentences || []);
    } catch (e) { setErr(String(e)); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 760, margin: "48px auto", fontFamily: "system-ui, sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 24 }}>Running Dictation — PDF test</h1>
      <p style={{ color: "#666" }}>Temporary page to prove the generate → @react-pdf download loop. Delete once the Grammar section exists.</p>
      <label style={{ display: "block", margin: "12px 0 4px", fontWeight: 600 }}>Skill</label>
      <select value={skill} onChange={(e) => setSkill(e.target.value)} style={{ padding: 6 }}>
        <option value="grammar">grammar</option>
        <option value="vocabulary">vocabulary</option>
      </select>
      <label style={{ display: "block", margin: "12px 0 4px", fontWeight: 600 }}>Content / targets</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} style={{ width: "100%", padding: 8 }} />
      <div style={{ display: "flex", gap: 12, margin: "14px 0", alignItems: "center" }}>
        <button onClick={gen} disabled={loading} style={{ padding: "8px 14px" }}>{loading ? "Generating…" : "Generate sentences"}</button>
        <DownloadStripsButton sentences={sentences} title="Running Dictation" fileName="running-dictation.pdf" style={{ padding: "8px 14px" }} />
        {err && <span style={{ color: "#b4532f" }}>{err}</span>}
      </div>
      <ol style={{ lineHeight: 1.7 }}>
        {sentences.map((s, i) => (
          <li key={i}>{s.sentence} {s.target ? <strong>[bold: {s.target}]</strong> : <em style={{ color: "#b4532f" }}>[no target]</em>}</li>
        ))}
      </ol>
    </div>
  );
}
