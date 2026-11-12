"use client";
// GistReadingCard.js
// Configure card for the "Reading for gist" stage (type "gistReading").
// Stores its settings in the generic per-stage bucket stageActivities[item.id].config,
// the same place activities use, so no new store fields are needed. The matching
// deck slide is GistReadingPresSection.

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const DEFAULTS = {
  book: "",
  page: "",
  title: "",
  gistQuestion: "",
  timeMinutes: 3,
  showTimer: true,
};

export default function GistReadingCard({ item, position }) {
  const stageId = item.id;
  const config =
    useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );

  // Seed defaults once so the deck slide has something to render.
  useEffect(() => {
    if (!useAudioTextStore.getState().stageActivities?.[stageId]?.config) {
      updateStageActivityConfig(stageId, DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const set = (patch) => updateStageActivityConfig(stageId, patch);
  const v = { ...DEFAULTS, ...config };

  return (
    <CardShell position={position} label="Reading for gist">
      <div style={st.grid}>
        <label style={st.lbl}>
          Book
          <input style={st.in} value={v.book} onChange={(e) => set({ book: e.target.value })} placeholder="e.g. Think 3" />
        </label>
        <label style={{ ...st.lbl, ...st.sm }}>
          Page
          <input style={st.in} value={v.page} onChange={(e) => set({ page: e.target.value })} />
        </label>
        <label style={st.lbl}>
          Text title
          <input style={st.in} value={v.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. A day in Hanoi" />
        </label>
      </div>
      <label style={{ ...st.lbl, marginTop: 12 }}>
        Gist question (what do they read for?)
        <input style={st.in} value={v.gistQuestion} onChange={(e) => set({ gistQuestion: e.target.value })} placeholder="e.g. Where does the writer live?" />
      </label>
      <div style={st.row}>
        <label style={{ ...st.lbl, ...st.sm }}>
          Time (min)
          <input type="number" min="1" style={st.in} value={v.timeMinutes} onChange={(e) => set({ timeMinutes: Number(e.target.value) || 1 })} />
        </label>
        <label style={st.check}>
          <input type="checkbox" checked={!!v.showTimer} onChange={(e) => set({ showTimer: e.target.checked })} />
          Show time limit on the slide
        </label>
      </div>
    </CardShell>
  );
}

const st = {
  grid: { display: "flex", gap: 12, flexWrap: "wrap" },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 12, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 110px", minWidth: 90 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
};
