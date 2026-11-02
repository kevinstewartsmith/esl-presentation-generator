// HotSeatPresSection.js
// The reveal.js slide run for the "Hot Seat" warm-up/lead-in activity.
// Reads the stage's config (stageActivities[item.id].config) and emits:
//   - rules (optional)                       — how to play
//   - per word set: a 2×3 numbered word grid — timer pill in the title row
//   - per word set: a "record your score" prompt   (if keepScore)
//   - a "tally up" prompt at the end               (if keepScore)
//
// Scoring is student-kept (motor / on paper) — the app holds no scores, so the
// score and totals slides are PROMPTS, not tallies. Uses the hedonic SlideFrame /
// InstructionSlide directly; the word grid scales to fit via useFitScale.

"use client";

import { Fragment } from "react";
import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import { useFitScale } from "@app/presentation/theme/hedonic/useFitScale";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

// Shown when the stage has no config yet (lets the slide render in a preview).
const DEMO = {
  sets: [
    {
      theme: "Jobs & work",
      words: [
        "a nurse",
        "a chef",
        "a plumber",
        "an architect",
        "a paramedic",
        "an entrepreneur",
      ],
    },
  ],
  timerSeconds: 60,
  keepScore: true,
  showRules: true,
};

function fmtTime(s) {
  const n = Math.max(0, parseInt(s, 10) || 0);
  return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
}

export default function HotSeatPresSection({ item }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const config = stageActivities?.[item.id]?.config ?? {};
  const sets =
    Array.isArray(config.sets) && config.sets.length ? config.sets : DEMO.sets;
  const timerSeconds = config.timerSeconds ?? DEMO.timerSeconds;
  const keepScore = config.keepScore ?? true;
  const showRules = config.showRules ?? true;

  return (
    <>
      {showRules && (
        <section className="slide-full">
          <InstructionSlide
            title="Hot Seat —"
            titleAccent="how to play"
            lines={[
              "One partner sits in the hot seat — facing AWAY from the screen.",
              "The other sees 6 words and describes each one — without saying it.",
              "Guess as many as you can before the timer runs out.",
              "Then swap roles and play the next set.",
            ]}
          />
        </section>
      )}

      {sets.map((set, i) => (
        <Fragment key={i}>
          <section className="slide-full">
            <RoundSlide
              set={set}
              index={i}
              total={sets.length}
              timerSeconds={timerSeconds}
            />
          </section>
          {keepScore && (
            <section className="slide-full">
              <ScoreSlide />
            </section>
          )}
        </Fragment>
      ))}

      {keepScore && (
        <section className="slide-full">
          <TotalsSlide />
        </section>
      )}
    </>
  );
}

function RoundSlide({ set, index, total, timerSeconds }) {
  const words = Array.from(
    { length: 6 },
    (_, i) => (set.words && set.words[i]) || "",
  );
  const dep = words.join("|") + "|" + (set.theme || "");
  const { ref } = useFitScale(dep, { min: 0.4, max: 1 });
  const timer = <span style={st.timer}>⏱ {fmtTime(timerSeconds)}</span>;

  return (
    <SlideFrame title={set.theme || "Hot Seat"} titleAccessory={timer}>
      <div style={st.fitBox}>
        <div ref={ref} style={st.gridScale}>
          <div style={st.grid}>
            {words.map((w, i) => (
              <div key={i} style={st.tile}>
                <span style={{ ...st.tn, ...RAMP[i] }}>{i + 1}</span>
                <span style={st.tw}>{w}</span>
              </div>
            ))}
          </div>
          <div style={st.foot}>Describe 1 → 6. Don't say the word!</div>
        </div>
      </div>
    </SlideFrame>
  );
}

function ScoreSlide() {
  return (
    <SlideFrame title="Record your" titleAccent="score">
      <div style={st.center}>
        <div style={st.prompt}>
          How many did you guess? Keep your own tally — on your fingers or on
          paper.
        </div>
        <div style={st.sub}>
          Now swap roles — the describer becomes the guesser.
        </div>
      </div>
    </SlideFrame>
  );
}

function TotalsSlide() {
  return (
    <SlideFrame title="Add up your" titleAccent="points">
      <div style={st.center}>
        <div style={{ ...st.prompt, fontSize: "46px" }}>
          Total your scores from every set. Highest score wins!
        </div>
      </div>
    </SlideFrame>
  );
}

// Easy → hard number-chip ramp: teal → blue → amber.
const RAMP = [
  { background: "linear-gradient(145deg,#4fa89a,#2f7d76)" },
  { background: "linear-gradient(145deg,#4fa89a,#2f7d76)" },
  { background: "linear-gradient(145deg,#4e95f7,#2f70d7)" },
  { background: "linear-gradient(145deg,#4e95f7,#2f70d7)" },
  { background: "linear-gradient(145deg,#e0a23f,#c98a2b)" },
  { background: "linear-gradient(145deg,#e0a23f,#c98a2b)" },
];

const st = {
  timer: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    border: "3px solid #c98a2b",
    color: "#c98a2b",
    fontWeight: 800,
    fontSize: "26px",
    borderRadius: "999px",
    padding: "6px 18px",
    fontVariantNumeric: "tabular-nums",
    boxShadow: "0 6px 14px rgba(201,138,43,.18)",
  },
  fitBox: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gridScale: {
    width: "100%",
    maxWidth: "1060px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    transformOrigin: "center center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 26px",
  },
  tile: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "#fff",
    border: "2px solid #e6e3db",
    borderRadius: "20px",
    padding: "18px 24px",
    boxShadow: "0 8px 22px rgba(40,55,80,.07)",
    minWidth: 0,
  },
  tn: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: "28px",
    flex: "0 0 auto",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  tw: {
    fontSize: "34px",
    fontWeight: 600,
    color: "#2f3134",
    lineHeight: 1.05,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  foot: {
    fontSize: "22px",
    color: "#8a857c",
    fontStyle: "italic",
    fontFamily: "'Fraunces', Georgia, serif",
    textAlign: "center",
  },
  center: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "28px",
    textAlign: "center",
  },
  prompt: {
    background: "#fff",
    border: "2px solid #e6e3db",
    borderRadius: "20px",
    padding: "34px 44px",
    fontSize: "40px",
    fontWeight: 600,
    color: "#2f3134",
    lineHeight: 1.25,
    maxWidth: "900px",
    boxShadow: "0 8px 22px rgba(40,55,80,.07)",
  },
  sub: {
    fontSize: "26px",
    color: "#6f6b63",
    fontStyle: "italic",
    fontFamily: "'Fraunces', Georgia, serif",
  },
};
