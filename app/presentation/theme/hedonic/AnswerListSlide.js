// AnswerListSlide.js  (hedonic theme)
// The "show all answers on one slide" recap: every reviewed question with its
// answer, in a single list. The whole list scales to fit the slide body via
// useFitScale, so any number of questions fits (same primitive as the
// instruction-card stack).
//
// Pure presentational — receives an array of { label, question, answer }.

import SlideFrame from "./SlideFrame";
import { useFitScale } from "./useFitScale";
import styles from "./AnswerListSlide.module.css";
import { LightbulbIcon } from "./icons";

export default function AnswerListSlide({ title = "Answers", items = [] }) {
  const { ref } = useFitScale(items.length, { max: 1, min: 0.35 });

  return (
    <SlideFrame title={title} icon={<LightbulbIcon />}>
      <div className={styles.fitBox}>
        <div ref={ref} className={styles.list}>
          {items.map((it, i) => (
            <div className={styles.row} key={it.id ?? i}>
              <span className={styles.num}>{i + 1}</span>
              <div className={styles.qa}>
                <div className={styles.question}>{it.question}</div>
                <div className={styles.answer}>{it.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
