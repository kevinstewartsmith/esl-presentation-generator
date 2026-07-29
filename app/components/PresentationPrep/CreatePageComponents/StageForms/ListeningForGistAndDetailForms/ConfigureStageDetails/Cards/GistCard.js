// GistCard.js
// Real gist card. When the teacher reaches this card in Configure Stage Details:
//   - if gist options are already stored -> show them (with the picked one marked)
//   - else if the prerequisites are met (transcript + questions + answers) ->
//     auto-generate 5 options via /api/generate-gist, store them
//   - else -> a readiness message (needs transcript/questions first)
//
// The card RENDERING at all already means the gist stage is included in the
// lesson (ConfigureStageDetails only maps included items), so prerequisite #1
// is satisfied by existence. This checks #2-4.
//
// Options + the teacher's pick persist in the store, so it only calls Gemini
// once (unless the teacher hits Regenerate).

"use client";

import { useEffect, useState } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import CardShell from "./CardShell";

export default function GistCard({ item, position }) {
  const s2tTranscript = useAudioTextStore((s) => s.s2tTranscript);
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const gistOptions = useAudioTextStore((s) => s.gistOptions);
  const selectedGist = useAudioTextStore((s) => s.selectedGist);
  const updateGistOptions = useAudioTextStore((s) => s.updateGistOptions);
  const updateSelectedGist = useAudioTextStore((s) => s.updateSelectedGist);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prerequisites (#2-4): transcript + at least one question + its answer.
  const hasTranscript = !!s2tTranscript && s2tTranscript.trim().length > 0;
  const questions = (comprehensionItems ?? [])
    .map((it) => it.question)
    .filter(Boolean);
  const answers = (comprehensionItems ?? [])
    .map((it) => it.answer)
    .filter(Boolean);
  const ready = hasTranscript && questions.length > 0 && answers.length > 0;

  const hasOptions = Array.isArray(gistOptions) && gistOptions.length > 0;

  console.log("GIST CARD:", {
    ready,
    hasOptions,
    hasTranscript,
    qLen: questions.length,
    aLen: answers.length,
  });

  async function generate() {
    console.log("GIST: calling /api/generate-gist");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-gist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: s2tTranscript,
          detailQuestions: questions,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (!Array.isArray(data.options)) throw new Error("Bad response");
      updateGistOptions(data.options);
    } catch (e) {
      console.error("Gist generation failed:", e);
      setError("Couldn't generate gist questions. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate ONCE when ready and nothing stored yet.
  useEffect(() => {
    if (ready && !hasOptions && !loading) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, hasOptions]);

  // --- Render states ---

  if (!ready) {
    return (
      <CardShell position={position} label="Listen for gist">
        <p style={styles.note}>
          Add the transcript and generate the comprehension questions first —
          the gist options are built from them.
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell
      position={position}
      label="Listen for gist"
      right={
        hasOptions ? (
          <button onClick={generate} disabled={loading} style={styles.regen}>
            {loading ? "…" : "Regenerate"}
          </button>
        ) : null
      }
    >
      <p style={styles.template}>
        &ldquo;Listen once. What is the main idea?&rdquo;
      </p>

      {loading && <p style={styles.note}>Generating gist options…</p>}
      {error && <p style={styles.error}>{error}</p>}

      {hasOptions && (
        <div style={styles.list}>
          <p style={styles.pickLabel}>Choose a gist question:</p>
          {gistOptions.map((opt, i) => {
            const isPicked =
              selectedGist && selectedGist.question === opt.question;
            return (
              <button
                key={i}
                onClick={() => updateSelectedGist(opt)}
                style={{
                  ...styles.option,
                  ...(isPicked ? styles.optionPicked : {}),
                }}
              >
                <span style={styles.optionQ}>{opt.question}</span>
                <span style={styles.optionA}>Answer: {opt.answer}</span>
              </button>
            );
          })}
        </div>
      )}
    </CardShell>
  );
}

const styles = {
  note: { fontSize: "13.5px", color: "#6f6b63", margin: 0 },
  error: { fontSize: "13px", color: "#b3261e", margin: "6px 0 0" },
  template: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "16px",
    margin: "0 0 12px",
  },
  pickLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6f6b63",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    margin: "0 0 8px",
  },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  option: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    padding: "10px 12px",
    border: "1px solid #e6e3db",
    borderRadius: "9px",
    background: "#fbfaf7",
    cursor: "pointer",
  },
  optionPicked: {
    borderColor: "#2f7d76",
    background: "#2f7d760f",
    boxShadow: "inset 0 0 0 1px #2f7d76",
  },
  optionQ: { fontWeight: 600, fontSize: "14px" },
  optionA: { fontSize: "12.5px", color: "#6f6b63" },
  regen: {
    fontSize: "12px",
    color: "#2f7d76",
    background: "none",
    border: "1px solid #2f7d76",
    borderRadius: "6px",
    padding: "3px 8px",
    cursor: "pointer",
  },
};
