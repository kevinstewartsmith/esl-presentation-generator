// ScrambleRoundSlide.js
// Hedonic rendering for a scramble round — "question" (scrambled words + play)
// and "answer" (natural passage + replay). One component; `variant` decides.
//
// The words live in a flex-filled box (.textBox) and useFitText scales the font
// down to fit that box, so long passages shrink instead of clipping.

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
  const { ref } = useFitText(text, { max: 84, min: 22, step: 2 });
  const isAnswer = variant === "answer";

  return (
    <SlideFrame title={title} titleAccent={titleAccent} icon={<HeadphonesIcon />}>
      <div className={styles.wrap}>
        {player ? <div className={styles.player}>{player}</div> : null}

        <div className={styles.textBox}>
          <div
            ref={ref}
            className={`${styles.text} ${isAnswer ? styles.answer : styles.scrambled}`}
          >
            {text}
          </div>
        </div>

        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </div>
    </SlideFrame>
  );
}
