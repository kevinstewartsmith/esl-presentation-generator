// WarmupActivityPresSection.js
// Presentation-side dispatcher for the Warm-up / Lead-in container stages — the
// twin of WarmupActivityCard on the configure side. Reads the chosen activity
// (stageActivities[item.id].activityType) and renders that activity's slide run.
//
// Add a new warm-up/lead-in activity = one entry here + its PresSection (mirror
// the ACTIVITY_REGISTRY in WarmupActivityCard).

"use client";

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import MemorySpeculatePresSection from "./MemorySpeculatePresSection";

const ACTIVITY_PRES_BY_TYPE = {
  memorySpeculate: MemorySpeculatePresSection,
};

export default function WarmupActivityPresSection({ item }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const activityType = stageActivities?.[item.id]?.activityType;
  const Section = activityType ? ACTIVITY_PRES_BY_TYPE[activityType] : null;
  return Section ? <Section item={item} /> : null;
}
