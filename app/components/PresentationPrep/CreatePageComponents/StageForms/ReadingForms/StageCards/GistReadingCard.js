"use client";
// GistReadingCard.js
// Configure card for the "Reading for gist" stage (type "gistReading").
//
// Book reference (book / page / title) is LESSON-WIDE source data, shared with
// the Source page (AddTextBook's GistExerciseInputs writes the same keys), so it
// binds to useReadingStore.inputTexts — edit it here or on the source, it's one
// value, always in sync. Only the gist-specific settings (question / time /
// timer) are stage-local, stored in stageActivities[item.id].config.

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const CONFIG_DEFAULTS = { gistQuestion: "", timeMinutes: 3, showTimer: true };

export default function GistReadingCard({ item, position }) {
  const stageId = item.id;

  // Stage-local config
  const config =
    useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );

  // Shared, lesson-wide book reference (same store the Source page writes to)
  const inputTexts = useReadingStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useReadingStore(
    (s) => s.updateInputTextForKey,
  );

  useEffect(() => {
    if (!useAudioTextStore.getState().stageActivities?.[stageId]?.config) {
      updateStageActivityConfig(stageId, CONFIG_DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const setCfg = (patch) => updateStageActivityConfig(stageId, patch);
  const c = { ...CONFIG_DEFAULTS, ...config };
  const t = inputTexts || {};

  return (
    <CardShell position={position} label="Reading for gist">
      <div style={st.hint}>Book reference is shared with your source — editing here updates it everywhere.</div>
      <div style={st.grid}>
        <label style={st.lbl}>
          Book
          <input style={st.in} value={t.book || ""} onChange={(e) => updateInputTextForKey("book", e.target.value)} placeholder="e.g. Think 3" />
        </label>
        <label style={{ ...st.lbl, ...st.sm }}>
          Page
          <input style={st.in} value={t.page || ""} onChange={(e) => updateInputTextForKey("page", e.target.value)} />
        </label>
        <label style={st.lbl}>
          Text title
          <input style={st.in} value={t.title || ""} onChange={(e) => updateInputTextForKey("title", e.target.value)} placeholder="e.g. A day in Hanoi" />
        </label>
      </div>
      <label style={{ ...st.lbl, marginTop: 12 }}>
        Gist question (what do they read for?)
        <input style={st.in} value={c.gistQuestion} onChange={(e) => setCfg({ gistQuestion: e.target.value })} placeholder="e.g. Where does the writer live?" />
      </label>
      <div style={st.row}>
        <label style={{ ...st.lbl, ...st.sm }}>
          Time (min)
          <input type="number" min="1" style={st.in} value={c.timeMinutes} onChange={(e) => setCfg({ timeMinutes: Number(e.target.value) || 1 })} />
        </label>
        <label style={st.check}>
          <input type="checkbox" checked={!!c.showTimer} onChange={(e) => setCfg({ showTimer: e.target.checked })} />
          Show time limit on the slide
        </label>
      </div>
    </CardShell>
  );
}

const st = {
  hint: { fontSize: 12, color: "#8a857a", fontStyle: "italic", marginBottom: 12 },
  grid: { display: "flex", gap: 12, flexWrap: "wrap" },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 12, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 110px", minWidth: 90 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
};
