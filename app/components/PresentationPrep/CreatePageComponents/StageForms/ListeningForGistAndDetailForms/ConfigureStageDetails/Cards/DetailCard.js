// DetailCard.js
// Phase 1: display the detail comprehension questions + answers, read-only,
// with the snippet play button per item so the teacher can hear the clip while
// reviewing. Styling matches ScrambleCard (teal Fraunces number, uppercase
// tags, warm block).
//
// Later phases (see FLAGS): per-question include/audio toggles + presentation
// mode (Phase 2), inline edit (Phase 3), CEFR difficulty rating (Phase 4).

"use client";

import { useMemo } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import SnippetPlayer from "@app/components/SnippetPlayer";
import CardShell from "./CardShell";

export default function DetailCard({ item, position }) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);

  const snippetFileNames = useMemo(
    () => (comprehensionItems ?? []).map((it) => it.snippetFileNames),
    [comprehensionItems],
  );

  if (!comprehensionItems || comprehensionItems.length === 0) {
    return (
      <CardShell position={position} label="Listen for detail">
        <p style={styles.note}>
          Add the listening questions and answers first — they&rsquo;ll appear
          here to review.
        </p>
      </CardShell>
    );
  }

  const count = comprehensionItems.length;

  return (
    <CardShell
      position={position}
      label="Listen for detail"
      right={`${count} question${count === 1 ? "" : "s"}`}
    >
      <div style={styles.list}>
        {comprehensionItems.map((it, index) => (
          <div style={styles.block} key={index}>
            <div style={styles.blockMain}>
              <div style={styles.qRow}>
                <span style={styles.qNum}>{index + 1}</span>
                <span style={styles.question}>{it?.question}</span>
              </div>

              <div style={styles.answer}>
                <span style={styles.tag}>Answer</span>
                {it?.answer}
              </div>
            </div>

            <div style={styles.playCol}>
              <SnippetPlayer index={index} snippetFileNames={snippetFileNames} />
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

const styles = {
  note: { fontSize: "14px", color: "#6f6b63", margin: 0 },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  block: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "12px",
    alignItems: "start",
    padding: "14px",
    border: "1px solid #f0eee8",
    borderRadius: "10px",
    background: "#fbfaf7",
  },
  blockMain: { minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" },
  qRow: { display: "flex", gap: "8px", alignItems: "baseline" },
  qNum: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "15px",
    fontWeight: 600,
    color: "#2f7d76",
  },
  question: { fontWeight: 600, fontSize: "14.5px" },
  answer: { fontSize: "13.5px", color: "#3a3a3a" },
  tag: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    marginRight: "6px",
  },
  playCol: {
    width: "48px",
    display: "flex",
    justifyContent: "center",
    paddingTop: "2px",
  },
};
