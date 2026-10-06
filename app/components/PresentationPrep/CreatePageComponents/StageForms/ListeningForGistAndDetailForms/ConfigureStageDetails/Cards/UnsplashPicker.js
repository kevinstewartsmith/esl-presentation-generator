// UnsplashPicker.js
// Gallery-modal image picker for Memory & Speculate. Free-text search (+ AI
// keyword chips when provided by a later stage) -> /api/unsplash-search gallery
// -> pick fills a slot. On pick it fires the Unsplash download-trigger
// (/api/unsplash-download) per Unsplash API terms and returns the image with its
// photographer credit captured.

"use client";

import { useState, useEffect } from "react";

export default function UnsplashPicker({
  open,
  initialQuery = "",
  keywords = [],
  onPick,
  onClose,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery);
    setError(null);
    if (initialQuery) runSearch(initialQuery);
    else setResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuery]);

  async function runSearch(q) {
    const term = (q ?? query ?? "").trim();
    if (!term) return;
    setLoading(true);
    setError(null);
    try {
      // Reuse the existing route (returns the raw Unsplash payload); trim here.
      const res = await fetch(
        `/api/get-image-unsplash?query=${encodeURIComponent(term)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      const mapped = (data.results ?? []).map((p) => ({
        id: p.id,
        thumb: p.urls?.small ?? null,
        regular: p.urls?.regular ?? null,
        alt: p.alt_description ?? p.description ?? "",
        credit: {
          name: p.user?.name ?? "Unknown",
          profileUrl: p.user?.links?.html ?? null,
          photoUrl: p.links?.html ?? null,
        },
        downloadLocation: p.links?.download_location ?? null,
      }));
      setResults(mapped);
    } catch (e) {
      setError(e.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function pick(img) {
    // Unsplash requirement: trigger a download when the photo is used.
    if (img.downloadLocation) {
      fetch("/api/unsplash-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadLocation: img.downloadLocation }),
      }).catch(() => {});
    }
    onPick({ url: img.regular, source: "unsplash", credit: img.credit });
  }

  if (!open) return null;

  return (
    <div
      style={s.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={s.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Choose an image"
      >
        <div style={s.head}>
          <div style={s.top}>
            <h2 style={s.h2}>Choose an image</h2>
            <button style={s.x} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
          <form
            style={s.searchRow}
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a term…"
              style={s.input}
              autoFocus
              autoComplete="off"
              name="unsplash-image-search"
              spellCheck={false}
            />
            <button type="submit" style={s.btn}>
              Search
            </button>
          </form>
          {keywords.length > 0 && (
            <div style={s.chips}>
              {keywords.map((k) => (
                <button
                  key={k}
                  style={s.chip}
                  onClick={() => {
                    setQuery(k);
                    runSearch(k);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={s.body}>
          {loading && <div style={s.msg}>Searching…</div>}
          {error && <div style={s.msg}>{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div style={s.msg}>Search a term to see photos.</div>
          )}
          <div style={s.grid}>
            {results.map((img) => (
              <button
                key={img.id}
                style={s.tile}
                onClick={() => pick(img)}
                title={img.alt}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.thumb} alt={img.alt} style={s.tileImg} />
                <span style={s.tileCredit}>by {img.credit.name}</span>
              </button>
            ))}
          </div>
          {results.length > 0 && (
            <div style={s.note}>
              Picking a photo captures its Unsplash credit for the end slide.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(20,18,14,.55)",
    display: "grid",
    placeItems: "center",
    padding: "16px",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    border: "1px solid #e6e3db",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,.22)",
    width: "min(680px, 100%)",
    maxHeight: "88vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  head: {
    padding: "16px 18px",
    borderBottom: "1px solid #f0eee8",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  top: { display: "flex", alignItems: "center", gap: "10px" },
  h2: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "17px",
    fontWeight: 600,
    margin: 0,
    flex: 1,
    color: "#1c1c1e",
  },
  x: {
    border: 0,
    background: "transparent",
    fontSize: "20px",
    color: "#6f6b63",
    cursor: "pointer",
    lineHeight: 1,
    padding: "2px 6px",
    borderRadius: "6px",
  },
  searchRow: { display: "flex", gap: "8px", margin: 0 },
  input: {
    flex: 1,
    minWidth: 0,
    border: "1px solid #e6e3db",
    borderRadius: "8px",
    padding: "8px 11px",
    font: "inherit",
    fontSize: "13px",
    color: "#1c1c1e",
    background: "#fff",
  },
  btn: {
    font: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    border: "1px solid #2f7d76",
    background: "#2f7d76",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "6px" },
  chip: {
    font: "inherit",
    fontSize: "12px",
    cursor: "pointer",
    border: "1px solid #e6e3db",
    background: "#fff",
    color: "#3a3a3a",
    borderRadius: "20px",
    padding: "4px 11px",
  },
  body: { padding: "16px 18px", overflowY: "auto" },
  msg: { fontSize: "13px", color: "#8a857c", padding: "8px 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" },
  tile: {
    border: 0,
    padding: 0,
    cursor: "pointer",
    borderRadius: "9px",
    overflow: "hidden",
    background: "#fbfaf7",
    position: "relative",
  },
  tileImg: {
    width: "100%",
    aspectRatio: "3 / 2",
    objectFit: "cover",
    display: "block",
  },
  tileCredit: {
    display: "block",
    fontSize: "10px",
    color: "#8a857c",
    padding: "4px 6px",
    textAlign: "left",
  },
  note: { fontSize: "12px", color: "#b8b3a8", marginTop: "12px" },
};
