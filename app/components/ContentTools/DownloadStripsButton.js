"use client";
// DownloadStripsButton.js — SHARED. Click-to-download the cut-strips PDF.
// Surfaces any @react-pdf error on screen (not just the console) so failures
// are diagnosable.
import { useState } from "react";
import { downloadRunningDictationPdf } from "./RunningDictationPdf";

export default function DownloadStripsButton({ sentences, title, fileName, style, children }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const has = Array.isArray(sentences) && sentences.length > 0;

  const onClick = async () => {
    if (!has) return;
    setErr("");
    setBusy(true);
    try {
      await downloadRunningDictationPdf(sentences, { title, fileName });
    } catch (e) {
      console.error("PDF download failed", e);
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button onClick={onClick} disabled={busy || !has} style={style}>
        {busy ? "Preparing PDF…" : (children || "⬇ Download cut-strips PDF")}
      </button>
      {err ? <span style={{ color: "#b4532f", fontSize: 13 }}>PDF error: {err}</span> : null}
    </span>
  );
}
