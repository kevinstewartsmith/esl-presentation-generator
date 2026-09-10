// DetailCard.js
// Phases 1-3: display the detail comprehension questions + answers, with the
// snippet play button per item, per-question toggles (review / play clip),
// stage-level presentation modes, AND inline editing of the question + answer
// text (Phase 3). Edits persist via updateComprehensionItems.
//
// Later: CEFR difficulty rating (Phase 4) — will re-rate a question when its
// text changes here.

"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import SnippetPlayer from "@app/components/SnippetPlayer";
import CardShell from "./CardShell";
import {
  getDetailModes,
  getQuestionFlags,
} from "@app/components/FinalPresentationSections/detailConfigHelpers";
import { useAutoRateDifficulty } from "@app/components/FinalPresentationSections/useAutoRateDifficulty";

export default function DetailCard({ item, position }) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const updateComprehensionItems = useAudioTextStore(
    (s) => s.updateComprehensionItems,
  );

  const detailConfig = useAudioTextStore((s) => s.detailConfig);
  const updateDetailMode = useAudioTextStore((s) => s.updateDetailMode);
  const updateDetailPerQuestion = useAudioTextStore(
    (s) => s.updateDetailPerQuestion,
  );

  const detailRatings = useAudioTextStore((s) => s.detailRatings);
  const clearDetailRating = useAudioTextStore((s) => s.clearDetailRating);
  useAutoRateDifficulty(); // auto-generates when prerequisites met + not rated

  const snippetFileNames = useMemo(
    () => (comprehensionItems ?? []).map((it) => it.snippetFileNames),
    [comprehensionItems],
  );

  // Edit one field (question|answer) of item `index`, writing the whole array
  // back so it persists.
  const editField = (index, field, value) => {
    const next = (comprehensionItems ?? []).map((it, i) =>
      i === index ? { ...it, [field]: value } : it,
    );
    updateComprehensionItems(next);
    // rating is now stale for this question -> clear so it re-rates
    if (field === "question" || field === "answer") clearDetailRating(index);
  };

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

  const modes = getDetailModes(detailConfig);
  const count = comprehensionItems.length;

  return (
    <CardShell
      position={position}
      label="Listen for detail"
      right={`${count} question${count === 1 ? "" : "s"}`}
    >
      <div style={styles.list}>
        {comprehensionItems.map((it, index) => {
          const flags = getQuestionFlags(detailConfig, index);
          return (
            <div
              style={{ ...styles.block, opacity: flags.review ? 1 : 0.5 }}
              key={index}
            >
              <div style={styles.blockMain}>
                <div style={styles.qRow}>
                  <span style={styles.qNum}>{index + 1}</span>
                  <EditableText
                    value={it?.question ?? ""}
                    onCommit={(v) => editField(index, "question", v)}
                    style={styles.question}
                    placeholder="Question…"
                    multiline
                  />
                  {detailRatings?.[index]?.level && (
                    <span
                      style={styles.cefrBadge}
                      title={detailRatings[index].reason || ""}
                    >
                      {detailRatings[index].level}
                    </span>
                  )}
                </div>

                <div style={styles.answerRow}>
                  <span style={styles.tag}>Answer</span>
                  <EditableText
                    value={it?.answer ?? ""}
                    onCommit={(v) => editField(index, "answer", v)}
                    style={styles.answer}
                    placeholder="Answer…"
                    multiline
                  />
                </div>

                <div style={styles.toggleRow}>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={flags.review}
                      onChange={(e) =>
                        updateDetailPerQuestion(
                          index,
                          "review",
                          e.target.checked,
                        )
                      }
                    />
                    Review this answer
                  </label>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={flags.playClip}
                      onChange={(e) =>
                        updateDetailPerQuestion(
                          index,
                          "playClip",
                          e.target.checked,
                        )
                      }
                    />
                    Play clip for feedback
                  </label>
                </div>
              </div>

              <div style={styles.playCol}>
                <SnippetPlayer
                  index={index}
                  snippetFileNames={snippetFileNames}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.modesHeading}>How to present answers</div>
      <div style={styles.modes}>
        <label style={styles.modeRow}>
          <input
            type="checkbox"
            checked={modes.showSlideBySlide}
            onChange={(e) =>
              updateDetailMode("showSlideBySlide", e.target.checked)
            }
          />
          <div>
            <div style={styles.modeTitle}>Go over slide by slide</div>
            <div style={styles.modeSub}>
              One question per slide, answer revealed on click
            </div>
          </div>
        </label>
        <label style={styles.modeRow}>
          <input
            type="checkbox"
            checked={modes.showAllOnOneSlide}
            onChange={(e) =>
              updateDetailMode("showAllOnOneSlide", e.target.checked)
            }
          />
          <div>
            <div style={styles.modeTitle}>Show all answers on one slide</div>
            <div style={styles.modeSub}>
              A single recap slide with every answer
            </div>
          </div>
        </label>
      </div>
    </CardShell>
  );
}

// Click-to-edit text. Shows text; on click becomes a textarea; commits on blur.
// Controlled by the parent value, so external changes reflect immediately.
function EditableText({ value, onCommit, style, placeholder, multiline }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // put cursor at end
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };

  if (editing) {
    return (
      <textarea
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        rows={1}
        style={{ ...style, ...editStyles.input }}
      />
    );
  }

  return (
    <span
      style={{ ...style, ...editStyles.display }}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || <span style={editStyles.placeholder}>{placeholder}</span>}
    </span>
  );
}

const editStyles = {
  display: {
    cursor: "text",
    borderBottom: "1px dashed transparent",
    transition: "border-color 0.15s ease",
  },
  input: {
    width: "100%",
    minWidth: "220px",
    border: "1px solid #2f7d76",
    borderRadius: "6px",
    padding: "6px 10px",
    font: "inherit",
    resize: "vertical",
    background: "#fff",
  },
  placeholder: { color: "#b8b3a8", fontStyle: "italic" },
};

const styles = {
  note: { fontSize: "16px", color: "#6f6b63", margin: 0 },
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
    transition: "opacity 0.15s ease",
  },
  blockMain: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  qRow: { display: "flex", gap: "8px", alignItems: "baseline" },
  qNum: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#2f7d76",
    flexShrink: 0,
  },
  question: { fontWeight: 600, fontSize: "17px", flex: 1 },
  answerRow: { display: "flex", gap: "6px", alignItems: "baseline" },
  answer: { fontSize: "16px", color: "#3a3a3a", flex: 1 },
  tag: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    flexShrink: 0,
  },
  toggleRow: {
    display: "flex",
    gap: "16px",
    marginTop: "4px",
    paddingTop: "8px",
    borderTop: "1px solid #f0eee8",
    flexWrap: "wrap",
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#6f6b63",
    cursor: "pointer",
  },
  playCol: {
    width: "48px",
    display: "flex",
    justifyContent: "center",
    paddingTop: "2px",
  },
  modesHeading: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#8a857c",
    margin: "18px 0 8px",
  },
  modes: { display: "flex", flexDirection: "column", gap: "8px" },
  modeRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    border: "1px solid #f0eee8",
    borderRadius: "10px",
    background: "#fbfaf7",
    cursor: "pointer",
  },
  modeTitle: { fontSize: "16px" },
  modeSub: { fontSize: "13px", color: "#8a857c" },
  cefrBadge: {
    flexShrink: 0,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.02em",
    padding: "3px 9px",
    borderRadius: "20px",
    background: "#e6f1fb",
    color: "#185fa5",
    cursor: "default",
  },
};
