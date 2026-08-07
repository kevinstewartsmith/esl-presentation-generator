// AnswerRevealSlide.js  (hedonic theme)
// One comprehension question with its answer revealed on the next arrow press.
// The answer is wrapped in a reveal.js "fragment" — reveal hides it initially
// and fades it in when the presenter advances, WITHOUT leaving the slide.
//
// The theme stays clean: "fragment" is a global reveal.js class, so we only add
// a className — we don't import reveal or manage any state here.
//
// Pure presentational. useFitText scales the question + answer to fit.

import SlideFrame from "./SlideFrame";
import { useFitText } from "./useFitText";
import styles from "./AnswerRevealSlide.module.css";
import { LightbulbIcon } from "./icons";

export default function AnswerRevealSlide({
  label,
  answerLabel = "Answer",
  question,
  answer,
}) {
  const { ref: qRef } = useFitText(question, { max: 60, min: 24, step: 2 });
  const { ref: aRef } = useFitText(answer, { max: 56, min: 22, step: 2 });

  return (
    <SlideFrame title={label} icon={<LightbulbIcon />}>
      <div className={styles.wrap}>
        <div className={styles.questionBox}>
          <div ref={qRef} className={styles.question}>
            {question}
          </div>
        </div>

        {/* reveal.js fragment: hidden until the presenter advances */}
        <div className={`${styles.answerRow} fragment`}>
          <span className={styles.answerLabel}>{answerLabel}:</span>
          <div className={styles.answerBox}>
            <div ref={aRef} className={styles.answer}>
              {answer}
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
