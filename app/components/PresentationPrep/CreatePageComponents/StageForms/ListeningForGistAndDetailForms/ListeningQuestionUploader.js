// ListeningQuestionUploader.js
// Redesigned to match the Configure Stage Details aesthetic: eyebrow + serif
// heading, warm cards with numbered step badges. Wraps the existing
// TextBookInfoEntry (book/page/exercise) and AddTextBook (question/answer/
// transcript screenshots) components — their internals (dropzones, OCR output)
// are unchanged.
//
// Order: book reference first (establishes what's being digitized), then the
// screenshots. Audio is handled on a separate step, so it isn't here.

import React from "react";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";

const ListeningQuestionUploader = ({ stageID }) => {
  const sections = [
    { key: "ListeningQuestionText", label: "Questions" },
    { key: "ListeningAnswersText", label: "Answers" },
    { key: "ListeningTranscript", label: "Transcript" },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>Listening · Gist &amp; Detail</div>
        <h1 style={styles.title}>Add your source material</h1>
        <p style={styles.sub}>
          Note the book reference, then add screenshots of the questions,
          answers, and transcript. Audio is handled on the next step.
        </p>
      </header>

      {/* Step 1 — book reference */}
      <section style={styles.card}>
        <div style={styles.cardHead}>
          <span style={styles.num}>1</span>
          <span style={styles.cardLabel}>Book reference</span>
        </div>
        <TextBookInfoEntry
          category={"BookText"}
          stageID={stageID}
          showTitle={false}
        />
        <TextBookInfoEntry
          category={"QuestionText"}
          stageID={stageID}
          showExercisePage={false}
        />
      </section>

      {/* Step 2 — screenshots */}
      <section style={styles.card}>
        <div style={styles.cardHead}>
          <span style={styles.num}>2</span>
          <span style={styles.cardLabel}>Screenshots</span>
          <span style={styles.hint}>
            Questions and answers required · transcript optional
          </span>
        </div>
        <div style={styles.uploadGrid}>
          {sections.map(({ key, label }) => (
            <div key={key} style={styles.uploadCol}>
              <div style={styles.uploadColLabel}>{label}</div>
              <AddTextBook category={key} stageID={stageID} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1c1c1e",
    maxWidth: "min(1240px, 94vw)",
    margin: "0 auto",
    padding: "8px 4px 48px",
  },
  header: { marginBottom: "24px" },
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
    maxWidth: "62ch",
    lineHeight: 1.5,
    margin: 0,
  },
  card: {
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: "14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    padding: "18px 20px",
    marginBottom: "18px",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  num: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#e1f5ee",
    color: "#0f6e56",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  cardLabel: { fontWeight: 600, fontSize: "17px" },
  hint: { marginLeft: "auto", fontSize: "13px", color: "#8a857c" },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  },
  uploadCol: { minWidth: 0 },
  uploadColLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#3a3a3a",
    marginBottom: "8px",
  },
};

export default ListeningQuestionUploader;
