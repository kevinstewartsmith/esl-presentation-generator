// StandaloneHotSeatCard.js
// Hot Seat as its OWN stage (CATALOG type "hotSeat", dragged from the Bag of
// tricks) — as opposed to Hot Seat chosen INSIDE a Warm-up / Lead-in container.
//
// A container (WarmupActivityCard) provides the CardShell and an activity picker,
// then renders the plain HotSeatCard inside it. As a standalone stage there is no
// picker, so this thin wrapper provides the shell itself and renders the SAME
// HotSeatCard, keyed to this stage's own id. Config persists identically under
// stageActivities[item.id].config, so the present side (hotSeat -> HotSeatPresSection)
// reads it the same way.
"use client";

import CardShell from "./CardShell";
import HotSeatCard from "./HotSeatCard";

export default function StandaloneHotSeatCard({ item, position }) {
  return (
    <CardShell position={position} label="Hot Seat">
      <HotSeatCard stageId={item.id} />
    </CardShell>
  );
}
