// AnswerRevealSlide.js  (hedonic theme)
// One comprehension question with its answer revealed on the next arrow press.
// The answer is wrapped in a reveal.js "fragment" — reveal hides it initially
// and fades it in when the presenter advances, WITHOUT leaving the slide.
//
// TWO layouts:
//  • SIMPLE (listening): question + answer (+ optional audio player). Uses
//    useFitText on the two text nodes, inside the fixed-size boxes. Unchanged.
//  • RICH (reading): question + answer + evidence passage(s) + explanation. That
//    is too much for the fixed boxes (it clipped), so the whole stack is scaled
//    to fit the slide with useFitScale — nothing is clipped, any length fits.
// The branch is chosen by whether a passage or explanation was passed, so the
// listening slides are completely unaffected.

import SlideFrame from "./SlideFrame";
import { useFitText } from "./useFitText";
import { useFitScale } from "./useFitScale";
import styles from "./AnswerRevealSlide.module.css";
import { LightbulbIcon } from "./icons";

export default function AnswerRevealSlide({
  label,
  answerLabel = "Answer",
  question,
  answer,
  passage = null,
  passageLabel = "In the text",
  explanation = null,
  explanationLabel = "Why",
  player = null,
}) {
  // Normalize passages: each is a string or { text, para }.
  const rawPassages = Array.isArray(passage) ? passage : passage ? [passage] : [];
  const passages = rawPassages
    .map((p) => (typeof p === "string" ? { text: p, para: null } : { text: p?.text || "", para: p?.para ?? null }))
    .filter((p) => p.text.toString().trim());
  const hasExplanation = !!(explanation && String(explanation).trim());
  const rich = passages.length > 0 || hasExplanation;

  // Hooks are always called (unconditional); only the attached ref differs.
  const { ref: qRef } = useFitText(question, { max: 60, min: 24, step: 2 });
  const { ref: aRef } = useFitText(answer, { max: 56, min: 22, step: 2 });
  const scaleDep = `${question}|${answer}|${passages.map((p) => p.text).join("|")}|${explanation || ""}`;
  const { ref: scaleRef } = useFitScale(scaleDep, { max: 1.35, min: 0.3 });

  // ---- SIMPLE layout (listening): unchanged ----
  if (!rich) {
    return (
      <SlideFrame title={label} icon={<LightbulbIcon />}>
        <div className={styles.wrap}>
          <div className={styles.questionBox}>
            <div ref={qRef} className={styles.question}>{question}</div>
          </div>
          <div className={`${styles.answerRow} fragment`}>
            <span className={styles.answerLabel}>{answerLabel}:</span>
            <div className={styles.answerBox}>
              <div ref={aRef} className={styles.answer}>{answer}</div>
            </div>
            {player ? <div className={styles.player}>{player}</div> : null}
          </div>
        </div>
      </SlideFrame>
    );
  }

  // ---- RICH layout (reading): whole stack scales to fit, never clips ----
  return (
    <SlideFrame title={label} icon={<LightbulbIcon />}>
      <div style={r.fitBox}>
        <div ref={scaleRef} style={r.col}>
          <div style={r.question}>{question}</div>

          <div className="fragment" style={r.answerRow}>
            <span style={r.answerLabel}>{answerLabel}:</span>
            <div style={r.answerBox}><span style={r.answer}>{answer}</span></div>
            {player ? <div style={{ marginTop: 10 }}>{player}</div> : null}
          </div>

          {passages.length > 0 && (
            <div className="fragment" style={r.block}>
              <span style={r.blockLabel}>{passageLabel}</span>
              {passages.map((p, i) => (
                <blockquote key={i} style={r.quote}>
                  {p.para ? <span style={r.para}>¶{p.para}</span> : null}
                  “{String(p.text).trim()}”
                </blockquote>
              ))}
            </div>
          )}

          {hasExplanation && (
            <div className="fragment" style={r.block}>
              <span style={r.blockLabel}>{explanationLabel}</span>
              <div style={r.why}>{String(explanation).trim()}</div>
            </div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}

// Rich-layout styles (px, drawn against the 1280×720 canvas; useFitScale shrinks
// the whole subtree to fit, so these are natural/unscaled sizes).
const r = {
  fitBox: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  col: { display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 1040, textAlign: "center", transformOrigin: "center center" },
  question: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: "var(--heading)", overflowWrap: "break-word" },
  answerRow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" },
  answerLabel: { fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "var(--orange)" },
  answerBox: { display: "inline-flex", alignItems: "center", justifyContent: "center", maxWidth: "100%", padding: "14px 30px", background: "var(--orange-soft)", border: "2px solid var(--orange-border)", borderRadius: 24 },
  answer: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: "var(--orange-dark)", overflowWrap: "break-word" },
  block: { display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 940, textAlign: "left" },
  blockLabel: { fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8a857c" },
  quote: { margin: 0, padding: "8px 16px", borderLeft: "4px solid #2f7d76", background: "rgba(47,125,118,0.07)", fontStyle: "italic", color: "#2b2b2b", fontSize: 24, lineHeight: 1.4 },
  para: { fontStyle: "normal", fontWeight: 700, color: "#1c4a45", marginRight: "0.4em" },
  why: { fontSize: 22, lineHeight: 1.4, color: "#4a463f" },
};
