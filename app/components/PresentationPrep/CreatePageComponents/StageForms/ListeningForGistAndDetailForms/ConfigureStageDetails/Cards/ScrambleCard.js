// ScrambleCard.js
// The configure card for the decode/unscramble stage. ONE card with a block per
// comprehension item: the ANSWER as the header, then each supporting passage as
// its own SELECTABLE row (tick to include, untick to exclude) with a play button.
//
// Selection is per-passage and persists in scrambleConfig (via
// updateScramblePassage). The scramble SLIDES read the same selection, one slide
// per included passage. Passages under 3 words aren't scramble-able, so they
// don't appear here.
//
// [FLAG for later] inline edit of the passage/scramble text (Option B:
// item.variations.scramble) — parked; this card is select-only for now.

"use client";

import { useMemo } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import { getScramblePassageFlag } from "@app/components/FinalPresentationSections/scrambleConfigHelpers";
import SnippetPlayer from "@app/components/SnippetPlayer";
import CardShell from "./CardShell";

export default function ScrambleCard({ item, position }) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const scrambleConfig = useAudioTextStore((s) => s.scrambleConfig);
  const updateScramblePassage = useAudioTextStore(
    (s) => s.updateScramblePassage,
  );

  // Every scramble-able passage, grouped under its question.
  const groups = useMemo(() => {
    const rounds = buildScrambleRounds(comprehensionItems ?? []);
    const byQuestion = new Map();
    rounds.forEach((r) => {
      if (!byQuestion.has(r.questionIndex)) byQuestion.set(r.questionIndex, []);
      byQuestion.get(r.questionIndex).push(r);
    });
    return Array.from(byQuestion.entries()).map(([questionIndex, rows]) => ({
      questionIndex,
      answer: rows[0]?.questionAnswer ?? "",
      rows,
    }));
  }, [comprehensionItems]);

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

  if (groups.length === 0) {
    return (
      <CardShell position={position} label="Decode &amp; Unscramble">
        <p style={styles.note}>
          No passages are long enough to unscramble (rounds need at least 3
          words).
        </p>
      </CardShell>
    );
  }

  const selectedCount = groups.reduce(
    (n, g) =>
      n +
      g.rows.filter(
        (r) =>
          getScramblePassageFlag(scrambleConfig, r.questionIndex, r.passageIndex)
            .include,
      ).length,
    0,
  );

  return (
    <CardShell
      position={position}
      label="Decode &amp; Unscramble"
      right={`${selectedCount} selected`}
    >
      <div style={styles.list}>
        {groups.map((g) => (
          <div key={g.questionIndex} style={styles.block}>
            <div style={styles.answerHeader}>
              <span style={styles.tag}>Answer</span>
              <span style={styles.answerText}>{g.answer}</span>
            </div>

            <div style={styles.passages}>
              {g.rows.map((r) => {
                const included = getScramblePassageFlag(
                  scrambleConfig,
                  r.questionIndex,
                  r.passageIndex,
                ).include;
                const hasClip =
                  r.snippetFileName && r.snippetFileName !== "No Audio";

                return (
                  <div
                    key={r.passageIndex}
                    style={{ ...styles.passageRow, opacity: included ? 1 : 0.5 }}
                  >
                    {/* Clicking anywhere in this area toggles inclusion. The
                        checkbox is visual (readOnly) so the whole area is one
                        target; the play button sits OUTSIDE it so playing a clip
                        doesn't also toggle selection. */}
                    <div
                      style={styles.selectArea}
                      onClick={() =>
                        updateScramblePassage(
                          r.questionIndex,
                          r.passageIndex,
                          !included,
                        )
                      }
                      title={included ? "Click to exclude" : "Click to include"}
                    >
                      <input
                        type="checkbox"
                        checked={included}
                        readOnly
                        style={styles.checkbox}
                      />
                      <span style={styles.passageText}>
                        &ldquo;{r.passage}&rdquo;
                      </span>
                    </div>

                    <span style={styles.play}>
                      {hasClip ? (
                        <SnippetPlayer
                          index={0}
                          snippetFileNames={[r.snippetFileName]}
                        />
                      ) : (
                        <span style={styles.noAudio}>No audio</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

const styles = {
  note: { fontSize: "16px", color: "#6f6b63", margin: 0 },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  block: {
    padding: "14px",
    border: "1px solid #f0eee8",
    borderRadius: "10px",
    background: "#fbfaf7",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  answerHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    flexWrap: "wrap",
  },
  answerText: { fontWeight: 600, fontSize: "17px", color: "#1c1c1e" },
  passages: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderTop: "1px solid #f0eee8",
    paddingTop: "10px",
  },
  passageRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "10px",
    transition: "opacity 0.15s ease",
  },
  selectArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
    cursor: "pointer",
  },
  checkbox: { flexShrink: 0, cursor: "pointer", width: "16px", height: "16px" },
  passageText: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#3a3a3a",
    lineHeight: 1.5,
    minWidth: 0,
  },
  play: { display: "flex", alignItems: "center", justifyContent: "center" },
  noAudio: {
    fontSize: "12px",
    fontStyle: "italic",
    color: "#b8b3a8",
    whiteSpace: "nowrap",
  },
  tag: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    flexShrink: 0,
  },
};
