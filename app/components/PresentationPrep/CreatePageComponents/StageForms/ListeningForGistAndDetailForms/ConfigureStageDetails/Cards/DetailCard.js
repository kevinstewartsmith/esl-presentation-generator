// DetailCard.js
// Placeholder for now. Later: review/edit the detailed comprehension questions
// and answers, exercise format, timing, discussion after.

"use client";

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import CardShell from "./CardShell";

export default function DetailCard({ item, position }) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const count = comprehensionItems?.length ?? 0;

  return (
    <CardShell
      position={position}
      label="Listen for detail"
      right={`${count} question${count === 1 ? "" : "s"}`}
    >
      <p style={styles.todo}>
        Detailed comprehension questions will be reviewable and editable here.
        (Placeholder.)
      </p>
    </CardShell>
  );
}

const styles = {
  todo: { fontSize: "13px", color: "#8a857c", fontStyle: "italic", margin: 0 },
};
