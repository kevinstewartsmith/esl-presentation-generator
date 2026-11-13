"use client";
// VocabHuntCard.js
// Stage card for "Vocabulary Hunt" (a pre-reading READING stage). Pulls the hardest
// words out of the reading passage (useReadingStore.textbook) via Gemini
// (/api/get-vocab-hunt), sorted hardest -> easiest, then the teacher toggles
// which to include. Stored in the activity's config (stageActivities[id].config.words),
// each word: { word, pos, ipa, clue, example, paragraph, selected }.
// A normal stage card: wraps its content in CardShell.

import { useState } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

function textbookToText(tb) {
  if (!tb) return "";
  if (typeof tb === "string") return tb;
  if (Array.isArray(tb.textEdit)) return tb.textEdit.filter(Boolean).join("\n\n");
  if (typeof tb.text === "string") return tb.text;
  try {
    return JSON.stringify(tb);
  } catch {
    return "";
  }
}

export default function VocabHuntCard({ item, position }) {
  const stageId = item.id;
  const config =
    useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );
  const textbook = useReadingStore((s) => s.textbook);

  const words = Array.isArray(config.words) ? config.words : [];
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const findWords = async () => {
    const text = textbookToText(textbook);
    if (!text.trim()) {
      setErr("No reading text yet — add the reading on the Source page first.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/get-vocab-hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, level: config.level || "B1" }),
      });
      const { words: found = [] } = await res.json();
      // default: include the hardest few (first 6), teacher adjusts
      const withSel = found.map((w, i) => ({ ...w, selected: i < 6 }));
      updateStageActivityConfig(stageId, { words: withSel });
    } catch (e) {
      console.error(e);
      setErr("Couldn't fetch words. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) => {
    const next = words.map((w, j) => (j === i ? { ...w, selected: !w.selected } : w));
    updateStageActivityConfig(stageId, { words: next });
  };

  const includedCount = words.filter((w) => w.selected).length;

  return (
    <CardShell position={position} label="Vocabulary Hunt">
      <div style={st.head}>
        <button style={st.find} onClick={findWords} disabled={loading}>
          {loading ? "Finding…" : "✦ Find hard words"}
        </button>
        {words.length > 0 && (
          <span style={st.count}>{includedCount} of {words.length} included · hardest first</span>
        )}
      </div>
      {err && <div style={st.err}>{err}</div>}
      {words.length === 0 ? (
        <div style={st.empty}>
          Click <b>Find hard words</b> and the toughest vocabulary in your reading
          text appears here, hardest first. Toggle which to hunt for.
        </div>
      ) : (
        <ul style={st.list}>
          {words.map((w, i) => (
            <li key={i} style={{ ...st.row, opacity: w.selected ? 1 : 0.5 }}>
              <input type="checkbox" checked={!!w.selected} onChange={() => toggle(i)} style={st.cb} />
              <div style={st.body}>
                <div style={st.wline}>
                  <span style={st.word}>{w.word}</span>
                  {w.pos && <span style={st.pos}>{w.pos}</span>}
                  {w.paragraph ? <span style={st.para}>¶{w.paragraph}</span> : null}
                </div>
                {w.clue && <div style={st.clue}>{w.clue}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

const st = {
  head: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" },
  find: { border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", borderRadius: 9, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", font: "inherit" },
  count: { fontSize: 12.5, color: "#6f6b63" },
  err: { fontSize: 13, color: "#b4532f", marginBottom: 8 },
  empty: { fontSize: 13.5, color: "#b8b3a8", fontStyle: "italic", padding: "4px 0 8px", lineHeight: 1.5 },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", border: "1px solid #eee7da", borderRadius: 10, background: "#fcfbf8" },
  cb: { marginTop: 3 },
  body: { flex: 1, minWidth: 0 },
  wline: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" },
  word: { fontSize: 15, fontWeight: 700, color: "#1c1c1e" },
  pos: { fontSize: 12, color: "#6f6b63", fontStyle: "italic" },
  para: { fontSize: 11.5, fontWeight: 700, color: "#2f7d76", background: "#eef6f4", border: "1px solid #cfe3e0", borderRadius: 999, padding: "1px 7px" },
  clue: { fontSize: 13, color: "#44423d", marginTop: 2 },
};
