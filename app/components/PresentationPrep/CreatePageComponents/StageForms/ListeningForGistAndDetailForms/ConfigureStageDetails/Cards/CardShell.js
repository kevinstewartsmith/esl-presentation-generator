// CardShell.js
// Shared outer shell so every stage card is visually consistent: a numbered
// header with the stage label + an optional right-side slot, then the body.
// Each card composes this so the look stays uniform without repeating markup.

"use client";

export default function CardShell({ position, label, accent = "#2f7d76", right, children }) {
  return (
    <section style={styles.card}>
      <header style={styles.head}>
        <span style={{ ...styles.num, color: accent }}>{position}</span>
        <span style={styles.label}>{label}</span>
        {right ? <span style={styles.right}>{right}</span> : null}
      </header>
      <div style={styles.body}>{children}</div>
    </section>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #e6e3db", borderRadius: "14px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)", overflow: "hidden" },
  head: { display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderBottom: "1px solid #f0eee8" },
  num: { fontFamily: "'Fraunces', Georgia, serif", fontSize: "18px", fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  label: { fontWeight: 600, fontSize: "15px" },
  right: { marginLeft: "auto", fontSize: "12.5px", color: "#6f6b63" },
  body: { padding: "16px 18px" },
};
