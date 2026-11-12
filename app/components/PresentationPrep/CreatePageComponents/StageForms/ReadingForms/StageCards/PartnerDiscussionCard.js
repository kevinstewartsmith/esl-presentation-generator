"use client";
// PartnerDiscussionCard.js — Configure card for the "Partner discussion" stage.
// Everything is stage-local (stageActivities[item.id].config): the sentence-
// starter phrases (shown Partner A / Partner B, alternating) and the timer.

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const CONFIG_DEFAULTS = { phrases: ["", ""], timeMinutes: 3, showTimer: true };

export default function PartnerDiscussionCard({ item, position }) {
  const stageId = item.id;
  const config =
    useAudioTextStore((s) => s.stageActivities?.[stageId]?.config) ?? {};
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );

  useEffect(() => {
    if (!useAudioTextStore.getState().stageActivities?.[stageId]?.config) {
      updateStageActivityConfig(stageId, CONFIG_DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const setCfg = (patch) => updateStageActivityConfig(stageId, patch);
  const c = { ...CONFIG_DEFAULTS, ...config };
  const phrases = Array.isArray(c.phrases) ? c.phrases : [];

  const setPhrase = (i, val) => {
    const next = [...phrases];
    next[i] = val;
    setCfg({ phrases: next });
  };
  const addPhrase = () => setCfg({ phrases: [...phrases, ""] });
  const removePhrase = (i) => setCfg({ phrases: phrases.filter((_, j) => j !== i) });

  return (
    <CardShell position={position} label="Partner discussion">
      <div style={st.hint}>Sentence starters — shown as Partner A / Partner B, alternating.</div>
      {phrases.map((p, i) => (
        <div key={i} style={st.prow}>
          <span style={st.tag}>{i % 2 === 0 ? "A" : "B"}</span>
          <input style={st.in} value={p} onChange={(e) => setPhrase(i, e.target.value)} placeholder={i % 2 === 0 ? "I think…" : "I agree, and…"} />
          <button style={st.x} onClick={() => removePhrase(i)} title="Remove" aria-label="Remove phrase">×</button>
        </div>
      ))}
      <button style={st.add} onClick={addPhrase}>+ Add phrase</button>
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
  prow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  tag: { flex: "0 0 auto", width: 22, height: 22, borderRadius: 6, background: "#e7efed", color: "#1c4a45", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 },
  in: { flex: 1, border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit" },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 18, lineHeight: 1, fontWeight: 700 },
  add: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "8px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", marginBottom: 12 },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 4, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600 },
  sm: { flex: "0 0 120px" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
};
