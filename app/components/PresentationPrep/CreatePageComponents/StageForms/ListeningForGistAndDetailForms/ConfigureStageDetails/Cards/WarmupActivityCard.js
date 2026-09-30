// WarmupActivityCard.js
// The configure card for the Warm-up AND Lead-in container stages. Both stage
// types dispatch here (StageCard CARD_BY_TYPE). It is a TWO-LEVEL card:
//   1. no activity chosen yet -> show the activity picker (the registry below);
//   2. an activity chosen     -> render that activity's card, with a "Change" link.
//
// Adding a new warm-up/lead-in activity = one entry in ACTIVITY_REGISTRY + its
// card component. The card component is a plain content component (it does NOT
// wrap itself in CardShell — this container already provides the shell) and
// takes `stageId` so it reads/writes its config under stageActivities[stageId].

"use client";

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import CardShell from "./CardShell";
import MemorySpeculateCard from "./MemorySpeculateCard";

const ACTIVITY_REGISTRY = {
  memorySpeculate: {
    label: "Memory & Speculate",
    blurb: "Two images — each partner memorises one, then describes & speculates.",
    Card: MemorySpeculateCard,
  },
  // add more warm-up / lead-in activities here
};
const ACTIVITIES = Object.entries(ACTIVITY_REGISTRY).map(([id, a]) => ({
  id,
  ...a,
}));

export default function WarmupActivityCard({ item, position }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const setStageActivityType = useAudioTextStore(
    (s) => s.setStageActivityType,
  );

  const label = item.type === "leadIn" ? "Lead-in" : "Warm-up";
  const chosen = stageActivities?.[item.id]?.activityType ?? null;
  const activity = chosen ? ACTIVITY_REGISTRY[chosen] : null;

  // 1. Picker — no activity chosen yet.
  if (!activity) {
    return (
      <CardShell position={position} label={label}>
        <p style={styles.prompt}>
          Choose an activity for this {label.toLowerCase()}:
        </p>
        <div style={styles.grid}>
          {ACTIVITIES.map((a) => (
            <button
              key={a.id}
              style={styles.choice}
              onClick={() => setStageActivityType(item.id, a.id)}
            >
              <span style={styles.choiceLabel}>{a.label}</span>
              <span style={styles.choiceBlurb}>{a.blurb}</span>
            </button>
          ))}
        </div>
      </CardShell>
    );
  }

  // 2. Chosen — render the activity's card.
  const ActivityCard = activity.Card;
  return (
    <CardShell position={position} label={label}>
      <div style={styles.chosenHead}>
        <span style={styles.chosenName}>{activity.label}</span>
        <button
          style={styles.change}
          onClick={() => setStageActivityType(item.id, null)}
        >
          Change activity
        </button>
      </div>
      <ActivityCard stageId={item.id} />
    </CardShell>
  );
}

const styles = {
  prompt: { fontSize: "15px", color: "#6f6b63", margin: "0 0 14px" },
  grid: { display: "flex", flexDirection: "column", gap: "10px" },
  choice: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    background: "#fbfaf7",
    border: "1px solid #e6e3db",
    borderRadius: "10px",
    padding: "14px 16px",
    cursor: "pointer",
    font: "inherit",
  },
  choiceLabel: { fontWeight: 600, fontSize: "15px", color: "#1c1c1e" },
  choiceBlurb: { fontSize: "13px", color: "#6f6b63" },
  chosenHead: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "14px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f0eee8",
    flexWrap: "wrap",
  },
  chosenName: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1c1c1e",
  },
  change: {
    font: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    color: "#2f7d76",
    background: "transparent",
    border: "0",
    cursor: "pointer",
    padding: 0,
  },
};
