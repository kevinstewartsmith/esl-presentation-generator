"use client";
// DetailReadingCard.js — Configure card for the "Reading for detail" stage.
// Book reference (title / exercise page / exercises) is shared, lesson-wide
// source data bound to useReadingStore.inputTexts (in sync with the Source page).
// Stage-local config (stageActivities[item.id].config): time, showTimer, and the
// embedded partner-check (checkOn + editable A/B phrases). The detail ANSWER
// reveal pulls from the shared answer key (useReadingStore.answers).

import { useEffect } from "react";
import CardShell from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/Cards/CardShell";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CONFIG_DEFAULTS = {
  timeMinutes: 8,
  showTimer: true,
  checkOn: false,
  checkPhrases: DEFAULT_PHRASES,
};

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
  const phrases = Array.isArray(c.checkPhrases) ? c.checkPhrases : DEFAULT_PHRASES;

  const setPhrase = (i, v) => { const n = [...phrases]; n[i] = v; setCfg({ checkPhrases: n }); };
  const addPhrase = () => setCfg({ checkPhrases: [...phrases, ""] });
  const removePhrase = (i) => setCfg({ checkPhrases: phrases.filter((_, j) => j !== i) });

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

      <div style={st.note}>Answers reveal from your answer-key screenshot on the Source page.</div>

      {/* Embedded partner check */}
      <div style={st.section}>
        <label style={st.toggle}>
          <input type="checkbox" checked={!!c.checkOn} onChange={(e) => setCfg({ checkOn: e.target.checked })} />
          Partner check before answers
        </label>
        {c.checkOn && (
          <div style={st.phr}>
            {phrases.map((p, i) => (
              <div key={i} style={st.prow}>
                <span style={st.tag}>{i % 2 === 0 ? "A" : "B"}</span>
                <input style={st.in} value={p} onChange={(e) => setPhrase(i, e.target.value)} />
                <button style={st.x} onClick={() => removePhrase(i)} aria-label="Remove">×</button>
              </div>
            ))}
            <button style={st.add} onClick={addPhrase}>+ Add line</button>
          </div>
        )}
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
  note: { fontSize: 12.5, color: "#8a857a", fontStyle: "italic", marginTop: 12 },
  grid: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 },
  row: { display: "flex", gap: 16, alignItems: "flex-end", marginTop: 16, flexWrap: "wrap" },
  lbl: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: "#6f6b63", fontWeight: 600, flex: 1, minWidth: 160 },
  sm: { flex: "0 0 120px", minWidth: 100 },
  in: { border: "1px solid #e6e3db", borderRadius: 9, padding: "9px 11px", fontSize: 14.5, color: "#1c1c1e", background: "#fff", font: "inherit", flex: 1 },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
  section: { marginTop: 16, paddingTop: 14, borderTop: "1px solid #eee7da" },
  toggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#44423d", fontWeight: 600 },
  phr: { marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  prow: { display: "flex", alignItems: "center", gap: 8 },
  tag: { flex: "0 0 auto", width: 22, height: 22, borderRadius: 6, background: "#e7efed", color: "#1c4a45", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 },
  x: { border: 0, background: "transparent", color: "#2f7d76", cursor: "pointer", fontSize: 18, fontWeight: 700 },
  add: { border: "1px dashed #cfcabf", background: "#fcfbf8", color: "#6f6b63", borderRadius: 9, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" },
};
