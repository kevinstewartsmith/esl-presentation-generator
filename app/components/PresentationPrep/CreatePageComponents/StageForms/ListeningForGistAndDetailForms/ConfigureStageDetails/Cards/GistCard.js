// GistCard.js
// Placeholder for now. Later: show the gist instructions template, let the
// teacher add/edit the gist question (AI-derived from transcript + detail Qs),
// set timing, etc.

"use client";

import CardShell from "./CardShell";

export default function GistCard({ item, position }) {
  return (
    <CardShell position={position} label="Listen for gist">
      <p style={styles.template}>
        &ldquo;Listen once. What is the main idea?&rdquo;
      </p>
      <p style={styles.todo}>
        Gist question and timing will be editable here. (Placeholder.)
      </p>
    </CardShell>
  );
}

const styles = {
  template: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "16px", margin: "0 0 8px" },
  todo: { fontSize: "13px", color: "#8a857c", fontStyle: "italic", margin: 0 },
};
