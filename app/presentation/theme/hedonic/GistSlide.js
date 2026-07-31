// GistSlide.js
// Hedonic theme's rendering of the gist slide.
//
// PURE PRESENTATIONAL. No store imports, no data fetching, no app knowledge.
// It receives the view model documented in sections/gistSlideModel.js and
// decides what that looks like in this theme. Swapping themes swaps this file.

import SlideFrame from "./SlideFrame";
import InstructionCard from "./InstructionCard";
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

export default function GistSlide({ title, titleAccent, steps = [] }) {
  return (
    <SlideFrame
      title={title}
      titleAccent={titleAccent}
      icon={<HeadphonesIcon />}
    >
      <div className={styles.instructions}>
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
    </SlideFrame>
  );
}
