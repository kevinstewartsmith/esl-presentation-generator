import React from "react";
import GetAudioTranscript from "@app/components/GetAudioTranscript";
import AudioUploader from "@app/components/PresentationPrep/AudioUploader";

// Vertical flow: page header, then audio (the action) on top, transcript (the
// result) below — both full width, on the warm cream surface.

const ListeningUploadandTranscribeAudio = () => {
  return (
    <div style={styles.page}>
      <div style={styles.stack}>
        <header style={styles.header}>
          <div style={styles.eyebrow}>Listening · Gist &amp; Detail</div>
          <h1 style={styles.title}>Audio &amp; transcript</h1>
          <p style={styles.sub}>
            Pick your recording, generate the transcript, and review it below.
          </p>
        </header>

        <AudioUploader />
        <GetAudioTranscript />
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#fbf9f4",
    minHeight: "100%",
    padding: "24px 4px 40px",
  },
  stack: {
    maxWidth: "min(920px, 94vw)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: { marginBottom: 2 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#2f7d76",
    fontWeight: 600,
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 28,
    fontWeight: 600,
    margin: "3px 0 6px",
    letterSpacing: "-0.01em",
    color: "#1c1c1e",
  },
  sub: { fontSize: 14, color: "#6f6b63", margin: 0 },
};

export default ListeningUploadandTranscribeAudio;
