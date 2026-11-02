// HotSeatCard.js
// The "Hot Seat" warm-up/lead-in activity configure surface.
// Rendered INSIDE WarmupActivityCard (which provides the CardShell), so this is
// a plain content component. State persists under stageActivities[stageId].config
// via updateStageActivityConfig.
//
// config shape:
//   { sets: [ { theme, words: [6 strings] } ],
//     sources: { lessonMaterials, vocabScreenshots, generic, genericLevel },
//     timerSeconds, keepScore, showRules }
//
// Stage 1 is MANUAL: type the themes and words. The ✦ word-suggestion buttons
// (lesson materials / vocab screenshots / generic-by-level) land in a later
// stage; the source toggles persist now so the choice is ready for them.

"use client";

import { useEffect, useState } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Easy → hard number-chip ramp: teal → blue → amber.
const CHIP = [
  "linear-gradient(145deg,#4fa89a,#2f7d76)",
  "linear-gradient(145deg,#4fa89a,#2f7d76)",
  "linear-gradient(145deg,#4e95f7,#2f70d7)",
  "linear-gradient(145deg,#4e95f7,#2f70d7)",
  "linear-gradient(145deg,#e0a23f,#c98a2b)",
  "linear-gradient(145deg,#e0a23f,#c98a2b)",
];

function defaultSet() {
  return { theme: "", words: ["", "", "", "", "", ""] };
}
function defaultConfig() {
  return {
    sets: [defaultSet()],
    sources: {
      lessonMaterials: true,
      vocabScreenshots: true,
      generic: false,
      genericLevel: "B1",
    },
    timerSeconds: 60,
    keepScore: true,
    showRules: true,
  };
}

export default function HotSeatCard({ stageId }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );
  // Lesson content for AI word suggestions.
  const s2tTranscript = useAudioTextStore((s) => s.s2tTranscript);
  const selectedGist = useAudioTextStore((s) => s.selectedGist);
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const [busy, setBusy] = useState(null); // set index | "ext" | null

  const config = stageActivities?.[stageId]?.config ?? {};
  const sets = Array.isArray(config.sets) ? config.sets : [];
  const sources = config.sources ?? {};

  // Seed defaults once.
  useEffect(() => {
    if (!Array.isArray(config.sets) || config.sets.length === 0) {
      updateStageActivityConfig(stageId, defaultConfig());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const setSets = (next) => updateStageActivityConfig(stageId, { sets: next });
  const updateSet = (i, patch) =>
    setSets(sets.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const addSet = () => setSets([...sets, defaultSet()]);
  const removeSet = (i) => {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, j) => j !== i));
  };
  const setWord = (si, wi, val) =>
    updateSet(si, {
      words: (sets[si].words || []).map((w, j) => (j === wi ? val : w)),
    });
  const moveWord = (si, wi, dir) => {
    const ws = [...(sets[si].words || [])];
    const j = wi + dir;
    if (j < 0 || j >= ws.length) return;
    [ws[wi], ws[j]] = [ws[j], ws[wi]];
    updateSet(si, { words: ws });
  };

  const setSource = (patch) =>
    updateStageActivityConfig(stageId, { sources: { ...sources, ...patch } });

  const anySource = !!(
    sources.lessonMaterials ||
    sources.vocabScreenshots ||
    sources.generic
  );

  async function fetchWords(body) {
    const res = await fetch("/api/get-hotseat-words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: sources.genericLevel || "B1",
        count: 6,
        sources,
        transcript: s2tTranscript,
        gist: selectedGist,
        questionsAndAnswers: comprehensionItems,
        ...body,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Suggestion failed");
    return data;
  }

  async function suggestWords(si) {
    setBusy(si);
    try {
      const data = await fetchWords({
        theme: sets[si]?.theme || "",
        mode: "words",
      });
      if (Array.isArray(data.words) && data.words.length) {
        updateSet(si, {
          words: data.words,
          theme: sets[si]?.theme || data.theme || "",
        });
      }
    } catch (e) {
      console.error("suggestWords failed", e);
    } finally {
      setBusy(null);
    }
  }

  async function suggestExtension() {
    setBusy("ext");
    try {
      const existingWords = sets.flatMap((s) => s.words || []).filter(Boolean);
      const data = await fetchWords({
        theme: "",
        mode: "extension",
        existingWords,
      });
      if (Array.isArray(data.words) && data.words.length) {
        setSets([
          ...sets,
          { theme: data.theme || "Extension", words: data.words },
        ]);
      }
    } catch (e) {
      console.error("suggestExtension failed", e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div style={styles.note}>
        A describe-and-guess race: one partner faces away, the other describes
        the 6 words against the clock. Type a theme and six words (easy → hard)
        per set.
      </div>

      {/* SOURCE */}
      <div style={styles.sectionLabel}>Where the words come from</div>
      <div style={styles.srcList}>
        <SourceRow
          label="Lesson materials"
          desc="Target language & theme from this lesson's source."
          on={!!sources.lessonMaterials}
          onToggle={() =>
            setSource({ lessonMaterials: !sources.lessonMaterials })
          }
        />
        <SourceRow
          label="Vocab screenshots"
          desc="Words OCR'd from uploaded vocabulary screenshots."
          on={!!sources.vocabScreenshots}
          onToggle={() =>
            setSource({ vocabScreenshots: !sources.vocabScreenshots })
          }
        />
        <SourceRow
          label="Generic by level"
          desc="Level-appropriate words from a generic pool."
          on={!!sources.generic}
          onToggle={() => setSource({ generic: !sources.generic })}
          extra={
            <select
              aria-label="CEFR level"
              value={sources.genericLevel || "B1"}
              onChange={(e) => setSource({ genericLevel: e.target.value })}
              style={styles.select}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          }
        />
      </div>
      <div style={styles.aiStub}>
        ✦ Suggest fills a set's six words from the active sources; Suggest
        extension adds a harder, related set. Or just type them.
      </div>

      {/* WORD SETS */}
      <div style={{ ...styles.sectionLabel, marginTop: "20px" }}>Word sets</div>
      {sets.map((set, si) => (
        <div key={si} style={styles.setCard}>
          <div style={styles.setTop}>
            <input
              value={set.theme || ""}
              onChange={(e) => updateSet(si, { theme: e.target.value })}
              placeholder={`Theme for set ${si + 1} (e.g. Jobs & work)`}
              style={styles.themeInput}
              aria-label={`Theme for set ${si + 1}`}
            />
            <button
              style={styles.mini}
              onClick={() => removeSet(si)}
              disabled={sets.length <= 1}
              title="Remove set"
              aria-label="Remove set"
            >
              ×
            </button>
          </div>
          <div style={styles.words}>
            {Array.from({ length: 6 }, (_, wi) => (
              <div key={wi} style={styles.wordRow}>
                <span style={{ ...styles.idx, background: CHIP[wi] }}>
                  {wi + 1}
                </span>
                <input
                  value={(set.words && set.words[wi]) || ""}
                  onChange={(e) => setWord(si, wi, e.target.value)}
                  placeholder={
                    wi === 0 ? "easiest…" : wi === 5 ? "hardest…" : "word…"
                  }
                  style={styles.wordInput}
                  aria-label={`Set ${si + 1} word ${wi + 1}`}
                />
                <button
                  style={styles.icon}
                  onClick={() => moveWord(si, wi, -1)}
                  disabled={wi === 0}
                  title="Move up"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  style={styles.icon}
                  onClick={() => moveWord(si, wi, 1)}
                  disabled={wi === 5}
                  title="Move down"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
          <div style={styles.setFoot}>
            <button
              style={{
                ...styles.ai,
                ...(anySource && busy === null ? {} : styles.aiOff),
              }}
              onClick={() => suggestWords(si)}
              disabled={!anySource || busy !== null}
              title={
                anySource
                  ? "Fill these six words from the active sources"
                  : "Turn on a source above first"
              }
            >
              ✦ {busy === si ? "Thinking…" : "Suggest words"}
            </button>
          </div>
        </div>
      ))}
      <div style={styles.addRow}>
        <button style={styles.addSet} onClick={addSet}>
          + Add another word set
        </button>
        <button
          style={{
            ...styles.ai,
            ...(anySource && busy === null ? {} : styles.aiOff),
          }}
          onClick={suggestExtension}
          disabled={!anySource || busy !== null}
          title={
            anySource
              ? "Add a harder, related set"
              : "Turn on a source above first"
          }
        >
          ✦ {busy === "ext" ? "Thinking…" : "Suggest extension words"}
        </button>
      </div>

      {/* SETTINGS */}
      <div style={{ ...styles.sectionLabel, marginTop: "20px" }}>Settings</div>
      <div style={styles.settings}>
        <div style={styles.setRow}>
          <span style={styles.setLbl}>
            <b style={styles.lblB}>Timer per set</b>
            <span style={styles.lblD}>How long each describer has.</span>
          </span>
          <span style={styles.rangeWrap}>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={config.timerSeconds ?? 60}
              onChange={(e) =>
                updateStageActivityConfig(stageId, {
                  timerSeconds: parseInt(e.target.value, 10),
                })
              }
              style={{
                accentColor: "#2f7d76",
                width: "150px",
                maxWidth: "42vw",
              }}
              aria-label="Timer seconds"
            />
            <span style={styles.rangeVal}>{config.timerSeconds ?? 60}s</span>
          </span>
        </div>
        <Toggle
          label="Keep score"
          desc="Add a record-score prompt after each set and a tally-up slide at the end."
          on={config.keepScore ?? true}
          onToggle={() =>
            updateStageActivityConfig(stageId, {
              keepScore: !(config.keepScore ?? true),
            })
          }
        />
        <Toggle
          label="Show rules slide"
          desc="Open with a how-to-play slide."
          on={config.showRules ?? true}
          onToggle={() =>
            updateStageActivityConfig(stageId, {
              showRules: !(config.showRules ?? true),
            })
          }
        />
      </div>
    </div>
  );
}

function SourceRow({ label, desc, on, onToggle, extra }) {
  return (
    <label style={{ ...styles.srcRow, ...(on ? styles.srcRowOn : {}) }}>
      <input
        type="checkbox"
        checked={on}
        onChange={onToggle}
        style={styles.check}
      />
      <span style={styles.srcTx}>
        <b style={styles.srcB}>{label}</b>
        <span style={styles.srcD}>{desc}</span>
      </span>
      {extra ? <span style={{ flex: "0 0 auto" }}>{extra}</span> : null}
    </label>
  );
}

function Toggle({ label, desc, on, onToggle }) {
  return (
    <div style={styles.setRow}>
      <span style={styles.setLbl}>
        <b style={styles.lblB}>{label}</b>
        <span style={styles.lblD}>{desc}</span>
      </span>
      <button
        style={{ ...styles.toggle, ...(on ? styles.toggleOn : {}) }}
        onClick={onToggle}
        aria-pressed={on}
        aria-label={label}
      >
        <span style={{ ...styles.knob, ...(on ? styles.knobOn : {}) }} />
      </button>
    </div>
  );
}

const styles = {
  note: {
    fontSize: "14px",
    color: "#6f6b63",
    marginBottom: "16px",
    lineHeight: 1.5,
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#8a857c",
    marginBottom: "8px",
  },

  srcList: { display: "flex", flexDirection: "column", gap: "8px" },
  srcRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    border: "1px solid #e6e3db",
    borderRadius: "11px",
    padding: "11px 13px",
    cursor: "pointer",
    background: "#fbfaf7",
  },
  srcRowOn: { borderColor: "#2f7d76", background: "#e6f0ee" },
  check: {
    marginTop: "2px",
    accentColor: "#2f7d76",
    width: "16px",
    height: "16px",
    flex: "0 0 auto",
  },
  srcTx: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  srcB: { fontSize: "14px", fontWeight: 600, color: "#1c1c1e" },
  srcD: { fontSize: "12px", color: "#6f6b63", lineHeight: 1.4 },
  aiStub: {
    fontSize: "12px",
    color: "#b8b3a8",
    fontStyle: "italic",
    marginTop: "8px",
  },

  setCard: {
    border: "1px solid #e6e3db",
    borderRadius: "12px",
    background: "#fcfbf8",
    padding: "13px",
    marginBottom: "10px",
  },
  setTop: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "10px",
  },
  themeInput: {
    flex: 1,
    minWidth: 0,
    font: "inherit",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1c1c1e",
    border: "1px solid #e6e3db",
    borderRadius: "9px",
    padding: "9px 12px",
    background: "#fff",
  },
  words: { display: "flex", flexDirection: "column", gap: "7px" },
  wordRow: { display: "flex", alignItems: "center", gap: "8px" },
  idx: {
    width: "24px",
    height: "24px",
    borderRadius: "7px",
    flex: "0 0 auto",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  wordInput: {
    flex: 1,
    minWidth: 0,
    font: "inherit",
    fontSize: "14px",
    color: "#1c1c1e",
    border: "1px solid #e6e3db",
    borderRadius: "8px",
    padding: "8px 11px",
    background: "#fff",
  },
  icon: {
    border: "1px solid #e6e3db",
    background: "#fff",
    color: "#6f6b63",
    borderRadius: "6px",
    width: "26px",
    height: "26px",
    fontSize: "12px",
    cursor: "pointer",
    flex: "0 0 auto",
    padding: 0,
  },
  mini: {
    border: "1px solid #e6e3db",
    background: "#fff",
    color: "#6f6b63",
    borderRadius: "7px",
    width: "30px",
    height: "30px",
    fontSize: "15px",
    cursor: "pointer",
    flex: "0 0 auto",
  },
  addSet: {
    border: "1px dashed #cfcabf",
    background: "transparent",
    color: "#6f6b63",
    borderRadius: "11px",
    padding: "11px",
    fontSize: "14px",
    fontWeight: 600,
    flex: "1 1 220px",
    cursor: "pointer",
  },
  addRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  setFoot: { marginTop: "10px" },
  ai: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #2f7d76",
    background: "#e6f0ee",
    color: "#0f6e56",
    fontWeight: 600,
    font: "inherit",
    fontSize: "13px",
    borderRadius: "9px",
    padding: "8px 13px",
    cursor: "pointer",
  },
  aiOff: {
    borderColor: "#cfcbc2",
    background: "transparent",
    color: "#b8b3a8",
    cursor: "not-allowed",
  },

  settings: { display: "flex", flexDirection: "column", gap: "14px" },
  setRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
  },
  setLbl: { display: "flex", flexDirection: "column", gap: "2px" },
  rangeWrap: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    flex: "0 0 auto",
  },
  rangeVal: {
    fontVariantNumeric: "tabular-nums",
    fontWeight: 700,
    color: "#2f7d76",
    minWidth: "40px",
    textAlign: "right",
  },
  select: {
    font: "inherit",
    fontSize: "13px",
    padding: "6px 9px",
    border: "1px solid #e6e3db",
    borderRadius: "8px",
    background: "#fff",
    color: "#1c1c1e",
  },

  toggle: {
    width: "46px",
    height: "27px",
    borderRadius: "999px",
    background: "#d5d1c7",
    border: 0,
    position: "relative",
    cursor: "pointer",
    flex: "0 0 auto",
  },
  toggleOn: { background: "#2f7d76" },
  knob: {
    position: "absolute",
    top: "3px",
    left: "3px",
    width: "21px",
    height: "21px",
    borderRadius: "50%",
    background: "#fff",
    transition: "left .15s",
  },
  knobOn: { left: "22px" },
  lblB: { fontSize: "14px", fontWeight: 600, color: "#1c1c1e" },
  lblD: { fontSize: "12px", color: "#8a857c" },
};
