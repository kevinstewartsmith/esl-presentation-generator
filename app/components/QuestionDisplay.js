"use client";
import React from "react";
import SnippetPlayer from "./SnippetPlayer";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

// Configure aesthetic: numbered warm cards, question / answer / supporting
// passages as distinct roles, teal accents.
//
// Data shape (per comprehension item):
//   { number, question, answer,
//     passages: [ { text, indices, snippetFileName }, ... ],  // chronological
//     explanation? }                                           // added later
//
// Each passage gets its own SnippetPlayer. Passages with no locatable clip
// (snippetFileName null or "No Audio") show a muted "No audio" label instead.

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
          Each question with its answer and the passages from the audio that
          support it, in the order they&rsquo;re spoken. Play a clip to check the
          snippet.
        </p>
      </header>

      {items.length === 0 ? (
        <div style={styles.empty}>
          No questions yet — add them on the previous step.
        </div>
      ) : (
        <div style={styles.list}>
          {items.map((item, index) => {
            const passages = Array.isArray(item.passages)
              ? item.passages
              : [];

            return (
              <div key={index} style={styles.card}>
                <div style={styles.qRow}>
                  <span style={styles.num}>{index + 1}</span>
                  <span style={styles.question}>{item.question}</span>
                  {item.answer ? (
                    <span style={styles.answerBadge}>{item.answer}</span>
                  ) : null}
                </div>

                {item.explanation ? (
                  <div style={styles.explanationRow}>
                    <span style={styles.tag}>Why</span>
                    <span style={styles.explanation}>{item.explanation}</span>
                  </div>
                ) : null}

                {passages.length === 0 ? (
                  <div style={styles.passageRow}>
                    <span style={styles.tagMuted}>No passage found</span>
                  </div>
                ) : (
                  <div style={styles.passages}>
                    {passages.map((p, pIndex) => {
                      const hasClip =
                        p.snippetFileName &&
                        p.snippetFileName !== "No Audio";

                      return (
                        <div key={pIndex} style={styles.passageRow}>
                          <span style={styles.tag}>
                            {passages.length > 1
                              ? `Passage ${pIndex + 1}`
                              : "Passage"}
                          </span>
                          <span style={styles.passage}>
                            &ldquo;{p.text}&rdquo;
                          </span>
                          <div style={styles.playInline}>
                            {hasClip ? (
                              // SnippetPlayer's existing contract: (index,
                              // snippetFileNames[]) → plays snippetFileNames[index].
                              // Feed it a one-element array so it plays this
                              // passage's clip.
                              <SnippetPlayer
                                index={0}
                                snippetFileNames={[p.snippetFileName]}
                              />
                            ) : (
                              <span style={styles.tagMuted}>No audio</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
  sub: {
    fontSize: "15px",
    color: "#6f6b63",
    maxWidth: "60ch",
    lineHeight: 1.5,
    margin: 0,
  },
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
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: "14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    padding: "18px 20px",
  },
  qRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    flexWrap: "wrap",
  },
  num: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "17px",
    fontWeight: 700,
    color: "#2f7d76",
    flexShrink: 0,
  },
  question: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: 1.4,
    flex: 1,
    minWidth: "200px",
  },
  answerBadge: {
    flexShrink: 0,
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f6e56",
    background: "#e1f5ee",
    padding: "2px 12px",
    borderRadius: "20px",
  },
  explanationRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    paddingLeft: "2px",
  },
  explanation: {
    fontSize: "14px",
    color: "#4a4a4a",
    lineHeight: 1.5,
  },
  // One passage per row: tag | text (grows) | player, pinned right.
  passages: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderTop: "1px solid #f0ede6",
    paddingTop: "12px",
  },
  passageRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "10px",
  },
  tag: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  tagMuted: {
    fontSize: "12px",
    fontStyle: "italic",
    color: "#b8b3a8",
    whiteSpace: "nowrap",
  },
  passage: {
    fontSize: "15px",
    fontStyle: "italic",
    color: "#3a3a3a",
    lineHeight: 1.5,
    minWidth: 0,
  },
  playInline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

export default QuestionDisplay;
