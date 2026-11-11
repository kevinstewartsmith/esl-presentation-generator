// PlaceholderCard.js
// Fallback for any stage type that doesn't have a dedicated card yet (lead-in,
// pre-teach, peer-check, productive…). Keeps the page complete and clearly
// signals what's coming, so the dispatcher never renders nothing.

"use client";

import CardShell from "./CardShell";

const LABELS = {
  leadIn: "Lead-in",
  preTeach: "Pre-teach vocabulary",
  peerCheck: "Peer check",
  productive: "Productive task",
};

export default function PlaceholderCard({ item, position }) {
  const label = LABELS[item.type] ?? item.type;
  return (
    <CardShell position={position} label={label} accent="#c98a2b">
      <p style={styles.todo}>Configuration for this stage is coming soon.</p>
    </CardShell>
  );
}

const styles = {
  todo: { fontSize: "13px", color: "#8a857c", fontStyle: "italic", margin: 0 },
};
