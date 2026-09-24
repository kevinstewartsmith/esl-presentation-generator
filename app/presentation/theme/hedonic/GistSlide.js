// GistSlide.js
// Hedonic theme's rendering of the gist slide.
//
// PURE PRESENTATIONAL. No store imports, no data fetching, no app knowledge.
// It receives the view model documented in sections/gistSlideModel.js and
// decides what that looks like in this theme. Swapping themes swaps this file.
//
// `titleAccessory` (optional) is forwarded to SlideFrame and renders to the
// right of the title — used for the full-audio player, injected by the section.
//
// The instruction stack is wrapped in a scale-to-fit box (useFitScale), so ANY
// number of steps of ANY length shrinks uniformly to fit the slide body instead
// of overflowing/clipping — same fit behavior as InstructionSlide. The fit
// re-runs on the step CONTENT (not just the count), so a long question shrinks
// too, and it already handles the future case of more than two instructions.

import SlideFrame from "./SlideFrame";
import InstructionCard from "./InstructionCard";
import { useFitScale } from "./useFitScale";
import styles from "./GistSlide.module.css";
import {
  AudioWaveform,
  EarIcon,
  HeadphonesIcon,
  LightbulbIcon,
  QuestionBubbles,
} from "./icons";

// Theme-local mapping: semantic role -> this theme's visual treatment.
// Another theme maps the same roles to entirely different assets.
const ROLE_STYLE = {
  listen: {
    tone: "primary",
    icon: <EarIcon />,
    decoration: <AudioWaveform />,
    italicLabel: false,
  },
  answer: {
    tone: "accent",
    icon: <LightbulbIcon />,
    decoration: <QuestionBubbles />,
    italicLabel: true,
  },
};

const FALLBACK_STYLE = ROLE_STYLE.listen;

export default function GistSlide({
  title,
  titleAccent,
  steps = [],
  titleAccessory = null,
}) {
  // Re-fit whenever the number of steps OR their text changes — a signature of
  // the content, so a long question triggers a re-measure even though the card
  // count is unchanged.
  const fitDep = steps
    .map((s) => `${s.label ?? ""}|${s.body ?? ""}`)
    .join("¦");
  const { ref } = useFitScale(fitDep, { min: 0.4, max: 1 });

  return (
    <SlideFrame
      title={title}
      titleAccent={titleAccent}
      icon={<HeadphonesIcon />}
      titleAccessory={titleAccessory}
    >
      <div className={styles.fitBox}>
        <div ref={ref} className={styles.instructions}>
          {steps.map((step, index) => {
            const look = ROLE_STYLE[step.role] ?? FALLBACK_STYLE;

            return (
              <InstructionCard
                key={step.id ?? index}
                tone={look.tone}
                icon={look.icon}
                decoration={look.decoration}
                italicLabel={look.italicLabel}
                number={`${index + 1}.`}
                label={step.label}
              >
                {step.body}
              </InstructionCard>
            );
          })}
        </div>
      </div>
    </SlideFrame>
  );
}
