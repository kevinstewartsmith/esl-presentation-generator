// ScrambleCard.js
// The real card for the decode/unscramble stage. ONE card that contains a
// block per comprehension item: question, answer, snippet play button, passage,
// and (if available) the scramble.
//
// For today, scrambles are DERIVED from the comprehension items in-card via
// buildScrambleRounds (Option A). [FLAG for later: Option B — read a persisted
// item.variations.scramble instead of re-deriving, so the shuffle is stable and
// edits persist.]
//
// Click-to-edit: the passage and the scrambled text can be clicked to edit
// inline (basic edit for now — the sophisticated transcript-highlight re-cut is
// a separate day's work).

"use client";

import { useMemo, useState } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import SnippetPlayer from "@app/components/SnippetPlayer";
import CardShell from "./CardShell";

export default function ScrambleCard({ item, position }) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);

  // Derive the rounds from the items (Option A). Memoized so the random shuffle
  // is stable across re-renders within this mount.
  const rounds = useMemo(
    () => buildScrambleRounds(comprehensionItems ?? []),
    [comprehensionItems],
  );

  const snippetFileNames = useMemo(
    () => (comprehensionItems ?? []).map((it) => it.snippetFileNames),
    [comprehensionItems],
  );

  if (!comprehensionItems || comprehensionItems.length === 0) {
    return (
      <CardShell position={position} label="Decode &amp; Unscramble">
        <p style={styles.note}>
          Generate the audio snippets first — the scrambles come from the
          comprehension passages.
        </p>
      </CardShell>
    );
  }

  if (rounds.length === 0) {
    return (
      <CardShell position={position} label="Decode &amp; Unscramble">
        <p style={styles.note}>
          No passages are long enough to unscramble (rounds need at least 3
          words).
        </p>
      </CardShell>
    );
  }

  const includedCount = rounds.length;

  return (
    <CardShell
      position={position}
      label="Decode &amp; Unscramble"
      right={`${includedCount} scramble${includedCount === 1 ? "" : "s"}`}
    >
      <div style={styles.list}>
        {rounds.map((round) => (
          <ItemBlock
            key={round.index}
            round={round}
            item={comprehensionItems[round.index]}
            snippetFileNames={snippetFileNames}
          />
        ))}
      </div>
    </CardShell>
  );
}

// One comprehension item, shown as a block with its scramble.
function ItemBlock({ round, item, snippetFileNames }) {
  const [editing, setEditing] = useState(false);
  const [scrambleText, setScrambleText] = useState(round.scrambled);

  return (
    <div style={styles.block}>
      <div style={styles.blockMain}>
        <div style={styles.qRow}>
          <span style={styles.qNum}>{round.index + 1}</span>
          <span style={styles.question}>{item?.question}</span>
        </div>

        <div style={styles.answer}>
          <span style={styles.tag}>Answer</span>
          {item?.answer}
        </div>

        <div style={styles.passage}>
          <span style={styles.tag}>Passage</span>
          <span style={styles.passageText}>&ldquo;{round.passage}&rdquo;</span>
        </div>

        <div style={styles.scrambleRow}>
          <span style={styles.tag}>Scramble</span>
          {editing ? (
            <input
              value={scrambleText}
              onChange={(e) => setScrambleText(e.target.value)}
              onBlur={() => setEditing(false)}
              autoFocus
              style={styles.editInput}
            />
          ) : (
            <span
              style={styles.scrambleText}
              onClick={() => setEditing(true)}
              title="Click to edit"
            >
              {scrambleText}
            </span>
          )}
        </div>
      </div>

      <div style={styles.playCol}>
        <SnippetPlayer index={round.index} snippetFileNames={snippetFileNames} />
      </div>
    </div>
  );
}

const styles = {
  note: { fontSize: "14px", color: "#6f6b63", margin: 0 },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  block: { display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "start", padding: "14px", border: "1px solid #f0eee8", borderRadius: "10px", background: "#fbfaf7" },
  blockMain: { minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" },
  qRow: { display: "flex", gap: "8px", alignItems: "baseline" },
  qNum: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "15px", fontWeight: 600, color: "#2f7d76" },
  question: { fontWeight: 600, fontSize: "14.5px" },
  answer: { fontSize: "13.5px", color: "#3a3a3a" },
  passage: { fontSize: "13.5px", color: "#3a3a3a" },
  passageText: { fontStyle: "italic" },
  scrambleRow: { fontSize: "14px", display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" },
  scrambleText: { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "0.01em", cursor: "text", borderBottom: "1px dashed #c9c5bc", paddingBottom: "1px" },
  editInput: { flex: 1, minWidth: "220px", fontSize: "14px", padding: "4px 8px", border: "1px solid #2f7d76", borderRadius: "6px", fontFamily: "inherit" },
  tag: { display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c", marginRight: "6px" },
  playCol: { width: "48px", display: "flex", justifyContent: "center", paddingTop: "2px" },
};
