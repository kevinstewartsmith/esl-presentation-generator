// StatementSlide.js
// A big centered message in the body (not the header) — used for the scramble
// "pass" slide ("Erase and pass the board!"). Unlike InstructionSlide, the text
// is the body content, so it's vertically centered, and useFitText scales it to
// fit within the margins (no edge overflow, no wrapping off-screen).

import SlideFrame from "./SlideFrame";
import { useFitText } from "./useFitText";
import styles from "./StatementSlide.module.css";
import { HeadphonesIcon } from "./icons";

export default function StatementSlide({ text, accentText }) {
  const { ref } = useFitText(text, { max: 96, min: 32, step: 2 });

  return (
    <SlideFrame icon={<HeadphonesIcon />}>
      <div className={styles.box}>
        <div ref={ref} className={styles.text}>
          {text}
          {accentText ? <span className={styles.accent}> {accentText}</span> : null}
        </div>
      </div>
    </SlideFrame>
  );
}
