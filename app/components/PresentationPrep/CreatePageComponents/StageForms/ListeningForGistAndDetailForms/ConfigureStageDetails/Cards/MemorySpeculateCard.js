// MemorySpeculateCard.js
// The "Memory & Speculate" warm-up/lead-in activity configure surface.
// Rendered INSIDE WarmupActivityCard (which provides the CardShell), so this is
// a plain content component. All state persists under
// stageActivities[stageId].config via updateStageActivityConfig.
//
// config shape:
//   { A: { image, cefrMin, cefrMax, stems: [{level,text}] },
//     B: { ... },
//     keywords?: [...] }   // keywords filled by a later stage
//   image: { url, source: "unsplash"|"link", credit: { name, profileUrl, photoUrl } | null }
//
// STATUS: stems fully functional. Images: Unsplash picker (gallery + credit
// capture + download-trigger) and paste-link work. Upload + the ✦ AI keyword
// chips come in later stages.
//
// NOTE: the CEFR stem sets below are PLACEHOLDER content — the real curated
// A1–C2 library is task 16.

"use client";

import { useState, useEffect } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import UnsplashPicker from "./UnsplashPicker";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const STEMS = {
  A1: ["I can see …", "There is a …", "The person is …", "It is …", "I think the job is …", "Maybe the money is …"],
  A2: ["One thing I remember is …", "In the picture there is …", "The worker is … -ing", "I think this job is …", "It might be easy / hard / dangerous", "My guess is the salary is …"],
  B1: ["One thing I remember is that …", "I'm not sure, but I think the worker is …", "This job might be … because …", "The place around them looks …", "I guess you need … to do this job", "My guess is that the salary is …"],
  B2: ["One thing that stood out to me was …", "I'm fairly sure the worker is …, judging by …", "This job could be …, which suggests …", "The environment seems …, so …", "To do this you'd probably need …", "I'd estimate the salary is … because …"],
  C1: ["What struck me was …", "Judging by …, I'd say the worker is …", "It strikes me as … work, given …", "The setting implies …", "This role likely demands …", "I'd speculate the pay reflects …, since …"],
  C2: ["The detail that lingered was …", "The visual cues — … — suggest the worker is …", "One could infer this is … work, in that …", "The surroundings hint at …", "Such a role would presumably require …", "I'd venture the remuneration mirrors …, inasmuch as …"],
};

const DEFAULTS = { cefrMin: "A2", cefrMax: "B1", count: 4 };

function stemPool(min, max) {
  let lo = LEVELS.indexOf(min), hi = LEVELS.indexOf(max);
  if (lo > hi) [lo, hi] = [hi, lo];
  const levels = LEVELS.slice(lo, hi + 1);
  const maxLen = Math.max(...levels.map((l) => STEMS[l].length));
  const pool = [];
  for (let i = 0; i < maxLen; i++) {
    levels.forEach((l) => { if (STEMS[l][i]) pool.push({ level: l, text: STEMS[l][i] }); });
  }
  return pool;
}

function defaultPartner() {
  return {
    image: null,
    cefrMin: DEFAULTS.cefrMin,
    cefrMax: DEFAULTS.cefrMax,
    stems: stemPool(DEFAULTS.cefrMin, DEFAULTS.cefrMax).slice(0, DEFAULTS.count),
  };
}

export default function MemorySpeculateCard({ stageId }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const updateStageActivityConfig = useAudioTextStore(
    (s) => s.updateStageActivityConfig,
  );

  const config = stageActivities?.[stageId]?.config ?? {};
  const [picker, setPicker] = useState(null); // { side, query } | null

  useEffect(() => {
    const hasA = config.A?.stems?.length;
    const hasB = config.B?.stems?.length;
    if (!hasA && !hasB) {
      updateStageActivityConfig(stageId, { A: defaultPartner(), B: defaultPartner() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const partners = ["A", "B"];
  const setP = (p, patch) => setPartner(config, stageId, updateStageActivityConfig, p, patch);

  return (
    <div>
      <div style={styles.instructionsNote}>
        Each partner memorises one image, then describes it from memory. Pick two
        images and the sentence stems — the slides build themselves.
      </div>

      {/* IMAGES */}
      <div style={styles.sectionLabel}>
        Images <span style={styles.hint}>— left = Partner A, right = Partner B</span>
      </div>
      <div style={styles.duo}>
        {partners.map((p) => (
          <ImageSlot
            key={p}
            side={p}
            data={config[p] ?? {}}
            onSet={(image) => setP(p, { image })}
            onSearch={(query) => setPicker({ side: p, query })}
          />
        ))}
      </div>

      {/* STEMS */}
      <div style={{ ...styles.sectionLabel, marginTop: "20px" }}>
        Sentence stems <span style={styles.hint}>— pick a CEFR range, edit, reorder</span>
      </div>
      <div style={styles.duo}>
        {partners.map((p) => (
          <StemColumn key={p} side={p} data={config[p] ?? defaultPartner()} update={(patch) => setP(p, patch)} />
        ))}
      </div>

      <UnsplashPicker
        open={!!picker}
        initialQuery={picker?.query || ""}
        onPick={(image) => { if (picker) setP(picker.side, { image }); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    </div>
  );
}

function setPartner(config, stageId, updateFn, p, patch) {
  const cur = config[p] ?? defaultPartner();
  updateFn(stageId, { [p]: { ...cur, ...patch } });
}

// ---- Image slot ----
function ImageSlot({ side, data, onSet, onSearch }) {
  const image = data.image ?? null;
  return (
    <div style={styles.slot}>
      <div style={styles.slotHead}>
        <span style={styles.sideBadge}>{side}</span>
        <span style={styles.who}>Partner {side}</span>
        <span style={styles.arrow}>{side === "A" ? "← left" : "right →"}</span>
      </div>

      {image ? (
        <>
          <div style={styles.thumbWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="" style={styles.thumb} />
          </div>
          {image.credit ? (
            <div style={styles.credit}>
              Photo by{" "}
              <a href={image.credit.profileUrl || "#"} target="_blank" rel="noreferrer" style={styles.creditLink}>
                {image.credit.name}
              </a>{" "}
              on{" "}
              <a href="https://unsplash.com/?utm_source=chalk&utm_medium=referral" target="_blank" rel="noreferrer" style={styles.creditLink}>
                Unsplash
              </a>
            </div>
          ) : null}
          <div style={styles.slotActions}>
            <button style={styles.btnSubtle} onClick={() => onSearch("")}>Change</button>
            <button style={styles.btnSubtle} onClick={() => onSet(null)}>Remove</button>
          </div>
        </>
      ) : (
        <div style={styles.pick}>
          <form style={styles.searchRow} onSubmit={(e) => { e.preventDefault(); onSearch(e.currentTarget.q.value); }}>
            <input name="q" type="text" placeholder="Search Unsplash…" style={styles.input} />
            <button type="submit" style={styles.btnTiny}>Search</button>
          </form>
          <div style={styles.altRow}>
            <button type="button" style={styles.btnSubtle} onClick={() => onSearch("")}>Browse</button>
            <PasteLink onAdd={(url) => onSet({ url, source: "link", credit: null })} />
          </div>
          <div style={styles.stubNote}>Upload &amp; ✦ AI keyword suggestions come next.</div>
        </div>
      )}
    </div>
  );
}

function PasteLink({ onAdd }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return <button type="button" style={styles.btnSubtle} onClick={() => setOpen(true)}>Paste link</button>;
  }
  return (
    <form style={styles.searchRow} onSubmit={(e) => { e.preventDefault(); const u = e.currentTarget.url.value.trim(); if (u) onAdd(u); }}>
      <input name="url" type="text" placeholder="Image URL…" style={styles.input} autoFocus />
      <button type="submit" style={styles.btnTiny}>Add</button>
    </form>
  );
}

// ---- Stem column ----
function StemColumn({ side, data, update }) {
  const stems = data.stems ?? [];
  const min = data.cefrMin ?? DEFAULTS.cefrMin;
  const max = data.cefrMax ?? DEFAULTS.cefrMax;
  const single = min === max;

  const regen = (nextMin, nextMax, count) => {
    const pool = stemPool(nextMin, nextMax);
    update({ cefrMin: nextMin, cefrMax: nextMax, stems: pool.slice(0, count) });
  };
  const setMin = (v) => regen(v, max, stems.length || DEFAULTS.count);
  const setMax = (v) => regen(min, v, stems.length || DEFAULTS.count);
  const setCount = (v) => regen(min, max, parseInt(v, 10));

  const editStem = (i, text) => update({ stems: stems.map((s, j) => (j === i ? { ...s, text } : s)) });
  const deleteStem = (i) => { if (stems.length <= 1) return; update({ stems: stems.filter((_, j) => j !== i) }); };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= stems.length) return;
    const next = [...stems];
    [next[i], next[j]] = [next[j], next[i]];
    update({ stems: next });
  };
  const onDrop = (from, to) => {
    if (from === to) return;
    const next = [...stems];
    next.splice(to, 0, next.splice(from, 1)[0]);
    update({ stems: next });
  };

  return (
    <div style={styles.slot}>
      <div style={styles.ctlLabel}>Partner {side} · CEFR range</div>
      <div style={styles.rangeRow}>
        <select aria-label="From level" value={min} onChange={(e) => setMin(e.target.value)} style={styles.select}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <span style={styles.dash}>–</span>
        <select aria-label="To level" value={max} onChange={(e) => setMax(e.target.value)} style={styles.select}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {!single && <span style={styles.mixNote}>mixed for differentiation</span>}
      </div>

      <div style={{ ...styles.ctlLabel, marginTop: "10px" }}>Number of stems</div>
      <div style={styles.sliderRow}>
        <input type="range" min="1" max="6" value={stems.length} onChange={(e) => setCount(e.target.value)} aria-label="Number of stems" style={{ flex: 1, accentColor: "#2f7d76" }} />
        <span style={styles.count}>{stems.length}</span>
      </div>

      <div style={styles.stemList}>
        {stems.map((s, i) => (
          <StemRow
            key={i}
            index={i}
            stem={s}
            showLevel={!single}
            isFirst={i === 0}
            isLast={i === stems.length - 1}
            canDelete={stems.length > 1}
            onEdit={(t) => editStem(i, t)}
            onDelete={() => deleteStem(i)}
            onMove={(dir) => move(i, dir)}
            onDrop={onDrop}
          />
        ))}
      </div>

      <button style={styles.aiBtn} disabled title="Wired in the next step">
        ✦ Get stem suggestions
      </button>
    </div>
  );
}

function StemRow({ index, stem, showLevel, isFirst, isLast, canDelete, onEdit, onDelete, onMove, onDrop }) {
  return (
    <div
      style={styles.stem}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(index))}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onDrop(parseInt(e.dataTransfer.getData("text/plain"), 10), index); }}
    >
      <span style={styles.grip} title="Drag to reorder" aria-hidden>⠿</span>
      <span style={styles.n}>{index + 1}</span>
      {showLevel && <span style={styles.lvlTag}>{stem.level}</span>}
      <input value={stem.text} onChange={(e) => onEdit(e.target.value)} style={styles.stemInput} aria-label={`Stem ${index + 1}`} />
      <button style={styles.iconBtn} onClick={() => onMove(-1)} disabled={isFirst} title="Move up" aria-label="Move up">↑</button>
      <button style={styles.iconBtn} onClick={() => onMove(1)} disabled={isLast} title="Move down" aria-label="Move down">↓</button>
      <button style={styles.del} onClick={onDelete} disabled={!canDelete} title="Delete" aria-label="Delete stem">×</button>
    </div>
  );
}

const styles = {
  instructionsNote: { fontSize: "14px", color: "#6f6b63", marginBottom: "16px" },
  sectionLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8a857c", marginBottom: "12px" },
  hint: { fontWeight: 500, letterSpacing: 0, textTransform: "none", color: "#b8b3a8", fontSize: "12px" },
  duo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  slot: { border: "1px solid #e6e3db", borderRadius: "12px", background: "#fbfaf7", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 },
  slotHead: { display: "flex", alignItems: "center", gap: "8px" },
  sideBadge: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: "13px", color: "#fff", background: "#2f7d76", width: "26px", height: "26px", borderRadius: "7px", display: "grid", placeItems: "center", flexShrink: 0 },
  who: { fontWeight: 600, fontSize: "14px" },
  arrow: { marginLeft: "auto", color: "#b8b3a8", fontSize: "13px" },
  thumbWrap: { borderRadius: "10px", overflow: "hidden", border: "1px solid #e6e3db", aspectRatio: "3 / 2", background: "#eee" },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  credit: { fontSize: "11px", color: "#8a857c" },
  creditLink: { color: "#0f6e56", textDecoration: "none" },
  slotActions: { display: "flex", gap: "8px" },
  pick: { display: "flex", flexDirection: "column", gap: "10px" },
  searchRow: { display: "flex", gap: "8px", margin: 0, flex: 1, minWidth: 0 },
  altRow: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  input: { flex: 1, minWidth: 0, border: "1px solid #e6e3db", background: "#fff", borderRadius: "8px", padding: "8px 11px", font: "inherit", fontSize: "13px", color: "#1c1c1e" },
  stubNote: { fontSize: "12px", color: "#b8b3a8", fontStyle: "italic" },
  btnTiny: { font: "inherit", fontSize: "13px", fontWeight: 600, borderRadius: "8px", padding: "8px 12px", cursor: "pointer", border: "1px solid #2f7d76", background: "#2f7d76", color: "#fff", whiteSpace: "nowrap" },
  btnSubtle: { font: "inherit", fontSize: "13px", fontWeight: 500, borderRadius: "8px", padding: "6px 12px", cursor: "pointer", border: "1px solid #e6e3db", background: "#fff", color: "#3a3a3a", whiteSpace: "nowrap" },
  ctlLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8a857c" },
  rangeRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  select: { font: "inherit", fontSize: "13px", padding: "6px 8px", border: "1px solid #e6e3db", borderRadius: "8px", background: "#fff", color: "#1c1c1e" },
  dash: { color: "#8a857c" },
  mixNote: { fontSize: "11px", color: "#0f6e56", fontStyle: "italic" },
  sliderRow: { display: "flex", alignItems: "center", gap: "12px" },
  count: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, fontSize: "16px", color: "#0f6e56", minWidth: "1.4em", textAlign: "center", fontVariantNumeric: "tabular-nums" },
  stemList: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" },
  stem: { display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #f0eee8", borderRadius: "8px", padding: "6px 8px" },
  grip: { color: "#b8b3a8", fontSize: "13px", cursor: "grab", flexShrink: 0, userSelect: "none" },
  n: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, color: "#2f7d76", fontSize: "12px", flexShrink: 0 },
  lvlTag: { fontSize: "10px", fontWeight: 700, color: "#0f6e56", background: "#e1f5ee", borderRadius: "5px", padding: "1px 6px", flexShrink: 0 },
  stemInput: { flex: 1, minWidth: 0, border: "1px solid transparent", background: "transparent", borderRadius: "6px", padding: "4px 6px", font: "inherit", fontSize: "13px", color: "#3a3a3a" },
  iconBtn: { border: "1px solid #e6e3db", background: "#fff", color: "#6f6b63", borderRadius: "6px", width: "22px", height: "22px", fontSize: "12px", lineHeight: 1, cursor: "pointer", flexShrink: 0, padding: 0 },
  del: { border: "0", background: "transparent", color: "#b8b3a8", fontSize: "16px", lineHeight: 1, cursor: "pointer", padding: "0 2px", flexShrink: 0 },
  aiBtn: { alignSelf: "flex-start", border: "1px dashed #2f7d76", background: "transparent", color: "#0f6e56", fontWeight: 600, font: "inherit", fontSize: "13px", borderRadius: "8px", padding: "8px 12px", cursor: "not-allowed", opacity: 0.55, marginTop: "4px" },
};
