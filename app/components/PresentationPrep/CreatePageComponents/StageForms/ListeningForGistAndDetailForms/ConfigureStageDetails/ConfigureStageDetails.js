// ConfigureStageDetails.js
// The section AFTER StageComposer. It reads the arranged `slideOrder` and
// renders one card per stage, in order — each card is the editing/config
// surface for that stage (scramble, gist, detail, …).
//
// It only maps the order to cards; the individual card components live in
// ./cards and are dispatched by ./StageCard so this file never becomes a
// 500-line monster. Adding a new stage type = a new card file + one entry in
// StageCard's map. Nothing here changes.

"use client";

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import StageCard from "./StageCard";

export default function ConfigureStageDetails() {
  const slideOrder = useAudioTextStore((s) => s.slideOrder);

  const included = (slideOrder ?? []).filter((it) => it.included);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>Listening · Gist &amp; Detail</div>
        <h1 style={styles.title}>Configure stage details</h1>
        <p style={styles.sub}>
          Review and edit each stage in the order you arranged. Play snippets,
          adjust scrambles, and fill in anything missing before the slides are
          built.
        </p>
      </header>

      {included.length === 0 ? (
        <div style={styles.empty}>
          No stages yet. Arrange some on the previous screen first.
        </div>
      ) : (
        <div style={styles.stack}>
          {included.map((item, index) => (
            <StageCard key={item.id} item={item} position={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", color: "#1c1c1e", maxWidth: "820px", margin: "0 auto", padding: "8px 4px 48px" },
  header: { marginBottom: "24px" },
  eyebrow: { fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#2f7d76", fontWeight: 600 },
  title: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "32px", fontWeight: 600, margin: "2px 0 8px", letterSpacing: "-0.01em" },
  sub: { fontSize: "14px", color: "#6f6b63", maxWidth: "56ch", lineHeight: 1.5, margin: 0 },
  stack: { display: "flex", flexDirection: "column", gap: "18px" },
  empty: { padding: "32px", textAlign: "center", color: "#6f6b63", border: "1.5px dashed #e6e3db", borderRadius: "12px", fontSize: "14px" },
};
