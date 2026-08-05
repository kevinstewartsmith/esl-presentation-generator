// InstructionSlide.js
// Framed title + optional instruction lines: scramble instructions, the pass
// slide (title only), the ending slide, and the detail task slide.
//
// The card stack is wrapped in a scale-to-fit box (useFitScale) so ANY number
// of cards (2, 3, 4, 5) shrinks uniformly to fit the slide body — no per-count
// tuning, and it can never overflow into the header.

import SlideFrame from "./SlideFrame";
import InstructionCard from "./InstructionCard";
import { useFitScale } from "./useFitScale";
import styles from "./InstructionSlide.module.css";
import { HeadphonesIcon, EarIcon, LightbulbIcon } from "./icons";

const TONE_CYCLE = ["primary", "primary", "accent"];
const ICON_BY_TONE = {
  primary: <EarIcon />,
  accent: <LightbulbIcon />,
};

export default function InstructionSlide({
  title,
  titleAccent,
  lines = [],
  numbered = true,
  allPrimary = false,
  compact = false,
}) {
  const hasLines = lines && lines.length > 0;
  const { ref } = useFitScale(lines.length, { max: 1, min: 0.4 });

  return (
    <SlideFrame title={title} titleAccent={titleAccent} icon={<HeadphonesIcon />}>
      {hasLines ? (
        <div className={styles.fitBox}>
          <div ref={ref} className={styles.stack}>
            {lines.map((line, i) => {
              const tone = allPrimary ? "primary" : TONE_CYCLE[i] ?? "primary";
              return (
                <InstructionCard
                  key={i}
                  tone={tone}
                  icon={ICON_BY_TONE[tone]}
                  number={numbered ? `${i + 1}.` : null}
                  label={line}
                  compact={compact}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </SlideFrame>
  );
}
