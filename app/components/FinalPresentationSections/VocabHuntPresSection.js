"use client";
// VocabHuntPresSection.js
// Deck slides for the "Vocabulary Hunt" stage, built on the shared hedonic
// SlideFrame so they're shaped like the rest of the deck. Flow:
//   1. a rules slide (read the clue -> go to the paragraph -> find the word)
//   2. one slide per INCLUDED word: the CLUE shows first, then the word, its
//      pronunciation, the example, and the image reveal one at a time on the
//      right-arrow (reveal.js "fragment"s).
// Reads from the activity/stage config (stageActivities[item.id].config.words).

import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const DEMO = [
  {
    word: "rock pool",
    pos: "n.",
    ipa: "/ˈrɒk ˌpuːl/",
    clue: "a small pool of water among rocks by the sea, left behind when the tide goes out",
    example: "We found small crabs and starfish in the rock pool at low tide.",
    paragraph: 1,
    selected: true,
  },
];

export default function VocabHuntPresSection({ item }) {
  const config = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const stored = Array.isArray(config?.words) ? config.words.filter((w) => w.selected) : [];
  const words = stored.length ? stored : DEMO;
  const maxPara = words.reduce((m, w) => Math.max(m, Number(w.paragraph) || 0), 0);

  return (
    <>
      {/* Rules */}
      <section className="slide-full">
        <SlideFrame title="Vocabulary" titleAccent="Hunt">
          <ol style={s.rules}>
            <li>Read the clue</li>
            <li>Go to the paragraph{maxPara ? ` (1–${maxPara})` : ""}</li>
            <li>Find the word in the text that means this</li>
          </ol>
        </SlideFrame>
      </section>

      {/* One slide per word — clue first, the rest reveal on the arrow */}
      {words.map((w, i) => (
        <section className="slide-full" key={i}>
          <SlideFrame
            title="Vocabulary Hunt"
            subtitle={w.paragraph ? `Paragraph ${w.paragraph}` : undefined}
          >
            <div style={s.row}>
              <div style={s.left}>
                <div style={s.clue}>
                  <span style={s.lbl}>Clue:</span> {w.clue}
                </div>

                <div className="fragment" style={s.wordLine}>
                  <mark style={s.word}>{w.word}</mark>
                  {w.pos ? <span style={s.pos}> ({w.pos})</span> : null}
                </div>

                {w.ipa ? (
                  <div className="fragment" style={s.ipa}>🔊 {w.ipa}</div>
                ) : null}

                {w.example ? (
                  <div className="fragment" style={s.example}>
                    <span style={s.lbl}>Example:</span> <em>{w.example}</em>
                  </div>
                ) : null}
              </div>

              {w.img_url ? (
                <div className="fragment" style={s.right}>
                  <img src={w.img_url} alt={w.word} style={s.img} />
                </div>
              ) : null}
            </div>
          </SlideFrame>
        </section>
      ))}
    </>
  );
}

const s = {
  rules: { fontSize: "clamp(22px,3vw,40px)", lineHeight: 1.7, color: "#1c1c2e", paddingLeft: "1.2em", margin: 0 },
  row: { display: "flex", gap: "clamp(16px,3vw,40px)", alignItems: "flex-start", height: "100%" },
  left: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "clamp(12px,2vh,24px)" },
  clue: { background: "#fff", border: "1px solid #e6e3db", borderRadius: 16, padding: "clamp(12px,1.6vw,22px)", fontSize: "clamp(18px,2.1vw,30px)", lineHeight: 1.35, color: "#1c1c2e" },
  example: { background: "#fff", border: "1px solid #e6e3db", borderRadius: 16, padding: "clamp(12px,1.6vw,22px)", fontSize: "clamp(18px,2.1vw,30px)", lineHeight: 1.35, color: "#1c1c2e" },
  lbl: { color: "#2f7d76", fontWeight: 700 },
  wordLine: { fontSize: "clamp(30px,4.6vw,64px)", fontWeight: 800, display: "flex", alignItems: "baseline", gap: 10 },
  word: { background: "#f6e94b", color: "#1c1c2e", padding: "0 10px", borderRadius: 6 },
  pos: { fontSize: "0.45em", fontWeight: 600, color: "#2f7d76" },
  ipa: { fontSize: "clamp(18px,2vw,30px)", color: "#2f7d76", fontWeight: 600 },
  right: { flex: "0 0 36%", display: "flex", alignItems: "center", justifyContent: "center" },
  img: { width: "100%", height: "auto", maxHeight: "60vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" },
};
