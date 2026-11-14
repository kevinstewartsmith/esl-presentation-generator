// ReadingPassageSlide.js  (hedonic theme)
// Shows a reading passage on screen (reading-specific — listening keeps the
// text in the book). The whole passage scales down uniformly to fit the slide
// body via useFitScale, so any length fits without scrolling. Paragraph breaks
// in the source are preserved.
//
// Pure presentational: { title, passage, index, total }.

import SlideFrame from "./SlideFrame";
import { useFitScale } from "./useFitScale";
import { LightbulbIcon } from "./icons";

export default function ReadingPassageSlide({ title = "The text", passage = "", index, total }) {
  const paras = String(passage).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const { ref } = useFitScale(paras.join("").length, { max: 1, min: 0.3 });
  const subtitle = total && total > 1 ? `Part ${index + 1} of ${total}` : undefined;

  return (
    <SlideFrame title={title} subtitle={subtitle} icon={<LightbulbIcon />} plainTitle>
      <div style={styles.fitBox}>
        <div ref={ref} style={styles.col}>
          {(paras.length ? paras : [""]).map((p, i) => (
            <p key={i} style={styles.para}>{p}</p>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

const styles = {
  fitBox: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  col: { display: "flex", flexDirection: "column", gap: "0.7em", maxWidth: "26em", transformOrigin: "center center" },
  para: { margin: 0, fontFamily: "'Fraunces', Georgia, serif", fontSize: "30px", lineHeight: 1.45, color: "#2b2b2b" },
};
