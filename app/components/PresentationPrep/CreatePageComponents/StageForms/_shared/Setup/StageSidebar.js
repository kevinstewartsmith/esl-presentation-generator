// StageSidebar.js
// A sticky left-rail scroll-spy for the Configure page. Lists the arranged
// stages (number + name); highlights the one currently in view; click to scroll
// to it. Minimal for now — single accent for the active item, no per-stage
// colours yet (see FLAGS: per-stage color identity).

"use client";

import { useEffect, useState } from "react";

// Display label per stage type. (Later: pull from a shared stage registry with
// the icon + colour identity.)
const STAGE_LABEL = {
  gist: "Listen for gist",
  scramble: "Decode & Unscramble",
  detail: "Listen for detail",
  peerCheck: "Partner check",
};

function labelFor(type) {
  return STAGE_LABEL[type] ?? type;
}

export default function StageSidebar({ stages, anchorId }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!stages || stages.length === 0) return;

    const els = stages
      .map((s) => document.getElementById(anchorId(s.id)))
      .filter(Boolean);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stages, anchorId]);

  if (!stages || stages.length === 0) return null;

  const go = (id) => {
    const el = document.getElementById(anchorId(id));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav style={styles.rail} aria-label="Lesson stages">
      <div style={styles.railHeading}>Stages</div>
      <ul style={styles.list}>
        {stages.map((s, i) => {
          const active = activeId === anchorId(s.id);
          return (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                style={{
                  ...styles.item,
                  ...(active ? styles.itemActive : null),
                }}
              >
                <span
                  style={{
                    ...styles.num,
                    ...(active ? styles.numActive : null),
                  }}
                >
                  {i + 1}
                </span>
                <span style={styles.label}>{labelFor(s.type)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const ACCENT = "#2f7d76";

const styles = {
  rail: {
    position: "sticky",
    top: "24px",
    alignSelf: "flex-start",
    width: "220px",
    flexShrink: 0,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  railHeading: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8a857c",
    fontWeight: 700,
    padding: "0 10px",
    marginBottom: "8px",
  },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "2px" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "8px 10px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    color: "#6f6b63",
    fontSize: "14px",
    transition: "background 0.12s ease, color 0.12s ease",
  },
  itemActive: { background: "#eef5f4", color: "#1c1c1e", fontWeight: 600 },
  num: {
    flexShrink: 0,
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    background: "#f0eee8",
    color: "#8a857c",
    fontVariantNumeric: "tabular-nums",
  },
  numActive: { background: ACCENT, color: "#fff" },
  label: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
};
