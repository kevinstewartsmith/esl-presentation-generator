import React from "react";
import GetAudioTranscript from "@app/components/GetAudioTranscript";
import AudioUploader from "@app/components/PresentationPrep/AudioUploader";

// Vertical flow: audio (the action) on top, transcript (the result) below —
// both full width, on the warm cream surface. Replaces the old side-by-side
// Grid (and removes the stray orange debug border).

const ListeningUploadandTranscribeAudio = () => {
  return (
    <div style={styles.page}>
      <div style={styles.stack}>
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
  },
};

export default ListeningUploadandTranscribeAudio;
