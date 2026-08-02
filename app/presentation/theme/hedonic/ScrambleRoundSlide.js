// ScrambleRoundSlide.js
// Hedonic rendering for a scramble round — both the "question" kind (scrambled
// words + play) and the "answer" kind (natural passage + replay). One component,
// a `variant` decides which.
//
// The big text auto-fits its box (useFitText) so a long sentence scales down
// instead of overflowing. The audio control is injected by the section as
// `player` (audio is an app capability, not a theme concern) so this file stays
// pure presentational.

import SlideFrame from "./SlideFrame";
import { useFitText } from "./useFitText";
import styles from "./ScrambleRoundSlide.module.css";
import { HeadphonesIcon } from "./icons";

export default function ScrambleRoundSlide({
  variant = "question",
  title,
  titleAccent,
  text,
  hint,
  player = null,
}) {
  const { ref } = useFitText(text, { max: 92, min: 28, step: 2 });
  const isAnswer = variant === "answer";

  return (
    <SlideFrame title={title} titleAccent={titleAccent} icon={<HeadphonesIcon />}>
      <div className={styles.wrap}>
        {player ? <div className={styles.player}>{player}</div> : null}

        <div
          ref={ref}
          className={`${styles.text} ${isAnswer ? styles.answer : styles.scrambled}`}
        >
          {text}
        </div>

        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </div>
    </SlideFrame>
  );
}
