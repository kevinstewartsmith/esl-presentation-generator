"use client";
// DetailReadingCard.js — Configure card for the "Reading for detail" stage.
// Book reference (title / exercise page / exercises) is shared, lesson-wide
// source data bound to useReadingStore.inputTexts (in sync with the Source page);
// the time settings are stage-local (stageActivities[item.id].config).

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const CONFIG_DEFAULTS = { timeMinutes: 8, showTimer: true };

export default function DetailReadingCard({ item, position }) {
  const stageId = item.id;
  const config =
    useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );
  const inputTexts = useReadingStore((s) => s.inputTexts) ?? {};
  const updateInputTextForKey = useReadingStore((s) => s.updateInputTextForKey);

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
    <CardShell position={position} label="Reading for detail">
      <div style={st.hint}>Book reference is shared with your source — editing here updates it everywhere.</div>
      <label style={st.lbl}>
        Text title
        <input style={st.in} value={t.title || ""} onChange={(e) => updateInputTextForKey("title", e.target.value)} placeholder="e.g. A day in Hanoi" />
      </label>
      <div style={st.grid}>
        <label style={{ ...st.lbl, ...st.sm }}>
          Exercise page
          <input style={st.in} value={t.exercisePage || ""} onChange={(e) => updateInputTextForKey("exercisePage", e.target.value)} />
        </label>
        <label style={st.lbl}>
          Exercise(s)
          <input style={st.in} value={t.exercise || ""} onChange={(e) => updateInputTextForKey("exercise", e.target.value)} placeholder="e.g. 2 and 3" />
        </label>
      </div>
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
  grid: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 12, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 120px", minWidth: 100 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
};
