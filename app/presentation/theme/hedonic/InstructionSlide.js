// InstructionSlide.js
// Hedonic rendering for the "list of instructions" slide kinds: the scramble
// instructions, the between-rounds pass slide, and the ending slide. All three
// are the same shape — a framed title plus one or more instruction lines — so
// they share one component, driven by the view model's `lines`.
//
// Pure presentational. Composes SlideFrame + InstructionCard, so it inherits the
// hedonic background, header, and palette for free.

import SlideFrame from "./SlideFrame";
import InstructionCard from "./InstructionCard";
import gistStyles from "./GistSlide.module.css";
import {
  HeadphonesIcon,
  EarIcon,
  LightbulbIcon,
} from "./icons";

// Rotate role tone per line so a multi-line slide isn't monochrome — mirrors
// how the gist slide alternates listen/answer. Instructions read primary,
// primary, accent (the action); ending reads all primary (calm wrap-up).
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
}) {
  return (
    <SlideFrame title={title} titleAccent={titleAccent} icon={<HeadphonesIcon />}>
      <div className={gistStyles.instructions}>
        {lines.map((line, i) => {
          const tone = allPrimary ? "primary" : TONE_CYCLE[i] ?? "primary";
          return (
            <InstructionCard
              key={i}
              tone={tone}
              icon={ICON_BY_TONE[tone]}
              number={numbered ? `${i + 1}.` : null}
              label={line}
            />
          );
        })}
      </div>
    </SlideFrame>
  );
}
