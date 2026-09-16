"use client";
import React from "react";
import SnippetPlayer from "./SnippetPlayer";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

// Redesigned to the Configure aesthetic: numbered warm cards, proper type
// hierarchy (question / answer / supporting passage as distinct roles), teal
// accents. The SnippetPlayer (audio playback) is untouched.

function QuestionDisplay() {
  const comprehensionItems = useAudioTextStore(
    (state) => state.comprehensionItems,
  );

  const items = comprehensionItems ?? [];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>Listening · Gist &amp; Detail</div>
        <h1 style={styles.title}>Answer snippets</h1>
        <p style={styles.sub}>
          Each question with its answer and the passage from the audio that
          supports it. Play the clip to check the snippet.
        </p>
      </header>

      {items.length === 0 ? (
        <div style={styles.empty}>
          No questions yet — add them on the previous step.
        </div>
      ) : (
        <div style={styles.list}>
          {items.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.main}>
                <div style={styles.qRow}>
                  <span style={styles.num}>{index + 1}</span>
                  <span style={styles.question}>{item.question}</span>
                  {item.answer ? (
                    <span style={styles.answerBadge}>{item.answer}</span>
                  ) : null}
                </div>

                {item.passage ? (
                  <div style={styles.passageRow}>
                    <span style={styles.tag}>Passage</span>
                    <span style={styles.passage}>
                      &ldquo;{item.passage}&rdquo;
                    </span>
                  </div>
                ) : (
                  <div style={styles.passageRow}>
                    <span style={styles.tagMuted}>No passage found</span>
                  </div>
                )}
              </div>

              <div style={styles.playCol}>
                <SnippetPlayer
                  index={index}
                  snippetFileNames={items.map((it) => it.snippetFileNames)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1c1c1e",
    maxWidth: "min(1000px, 94vw)",
    margin: "0 auto",
    padding: "8px 4px 48px",
  },
  header: { marginBottom: "22px" },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#2f7d76",
    fontWeight: 600,
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "30px",
    fontWeight: 600,
    margin: "2px 0 8px",
    letterSpacing: "-0.01em",
  },
  sub: { fontSize: "15px", color: "#6f6b63", maxWidth: "60ch", lineHeight: 1.5, margin: 0 },
  empty: {
    padding: "32px",
    textAlign: "center",
    color: "#6f6b63",
    border: "1.5px dashed #e6e3db",
    borderRadius: "12px",
    fontSize: "15px",
  },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "16px",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: "14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    padding: "18px 20px",
  },
  main: { minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" },
  qRow: { display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" },
  num: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "17px",
    fontWeight: 700,
    color: "#2f7d76",
    flexShrink: 0,
  },
  question: { fontWeight: 600, fontSize: "16px", lineHeight: 1.4, flex: 1, minWidth: "200px" },
  answerBadge: {
    flexShrink: 0,
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f6e56",
    background: "#e1f5ee",
    padding: "2px 12px",
    borderRadius: "20px",
  },
  passageRow: { display: "flex", alignItems: "baseline", gap: "8px" },
  tag: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    flexShrink: 0,
  },
  tagMuted: {
    fontSize: "12px",
    fontStyle: "italic",
    color: "#b8b3a8",
  },
  passage: { fontSize: "15px", fontStyle: "italic", color: "#3a3a3a", lineHeight: 1.5 },
  playCol: { display: "flex", alignItems: "center", justifyContent: "center" },
};

export default QuestionDisplay;
