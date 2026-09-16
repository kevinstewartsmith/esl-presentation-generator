"use client";
import { useState } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

// Transcript panel: a "Get transcript" button (with a generating spinner) and
// the transcript in a contained, scrollable box. The transcription logic
// (getTranscript / createTimeArray) is unchanged — only a loading state + styling
// are added.

const GetAudioTranscript = () => {
  const selectedAudioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );
  const updateS2tTranscript = useAudioTextStore(
    (state) => state.updateS2tTranscript,
  );
  const updateWordTimeArray = useAudioTextStore(
    (state) => state.updateWordTimeArray,
  );
  const s2tTranscript = useAudioTextStore((state) => state.s2tTranscript);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function getTranscript() {
    if (!selectedAudioFileName) return;
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/google-api-s2t?name=${selectedAudioFileName}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      createTimeArray(data);

      const combinedTranscript = data
        .map((element) => element.alternatives[0].transcript)
        .join(" ");
      updateS2tTranscript(combinedTranscript);
    } catch (e) {
      console.error("getTranscript failed:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function createTimeArray(data) {
    const wordsInfo = data[data.length - 1].alternatives[0].words;
    updateWordTimeArray(wordsInfo);
  }

  return (
    <div style={styles.card}>
      <div style={styles.head}>
        <span style={styles.chip}>
          <i className="ti ti-file-text" style={{ fontSize: 14 }} aria-hidden="true" />
        </span>
        <span style={styles.label}>Transcript</span>
        <button
          onClick={getTranscript}
          disabled={loading || !selectedAudioFileName}
          style={{
            ...styles.btn,
            opacity: loading || !selectedAudioFileName ? 0.6 : 1,
            cursor: loading || !selectedAudioFileName ? "default" : "pointer",
          }}
        >
          {loading ? (
            <>
              <span style={styles.spinner} aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <i className="ti ti-file-text" style={{ fontSize: 14 }} aria-hidden="true" />
              {s2tTranscript ? "Regenerate" : "Get transcript"}
            </>
          )}
        </button>
      </div>

      <div style={styles.body}>
        {loading ? (
          <div style={styles.stateRow}>
            <span style={styles.spinnerDark} aria-hidden="true" />
            Generating transcript… this can take a moment.
          </div>
        ) : error ? (
          <div style={styles.errorRow}>
            Couldn&rsquo;t generate the transcript. Check the audio and try again.
          </div>
        ) : s2tTranscript ? (
          <p style={styles.transcript}>{s2tTranscript}</p>
        ) : (
          <div style={styles.emptyRow}>
            No transcript yet — pick an audio file and generate it.
          </div>
        )}
      </div>

      <style>{keyframes}</style>
    </div>
  );
};

const keyframes = `@keyframes gtspin { to { transform: rotate(360deg); } }`;

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    padding: "16px 20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  head: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  chip: {
    width: 24, height: 24, borderRadius: "50%",
    background: "#e1f5ee", color: "#0f6e56",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  label: { fontWeight: 600, fontSize: 15, color: "#1c1c1e" },
  btn: {
    marginLeft: "auto",
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#2f7d76", color: "#fff",
    border: "none", borderRadius: 9,
    padding: "7px 14px", fontSize: 13, fontWeight: 600,
  },
  body: {
    fontSize: 13, color: "#3a3a3a", lineHeight: 1.6,
    maxHeight: 300, overflowY: "auto",
    background: "#fbfaf7", border: "0.5px solid #f0eee8",
    borderRadius: 10, padding: "12px 14px",
  },
  transcript: { margin: 0 },
  stateRow: { display: "flex", alignItems: "center", gap: 10, color: "#6f6b63", fontStyle: "italic" },
  emptyRow: { color: "#b8b3a8", fontStyle: "italic" },
  errorRow: { color: "#b4462f" },
  spinner: {
    width: 13, height: 13, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff",
    display: "inline-block", animation: "gtspin 0.7s linear infinite",
  },
  spinnerDark: {
    width: 15, height: 15, borderRadius: "50%",
    border: "2px solid #d8d4cb", borderTopColor: "#2f7d76",
    display: "inline-block", animation: "gtspin 0.7s linear infinite",
    flexShrink: 0,
  },
};

export default GetAudioTranscript;
