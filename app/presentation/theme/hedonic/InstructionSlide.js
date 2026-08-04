// InstructionSlide.js
// Framed title + optional instruction lines: scramble instructions, the pass
// slide (title only), and the ending slide. `compact` shrinks the cards so 3+
// fit the 720px canvas (the base sizes are tuned for the gist slide's 2 cards).

import SlideFrame from "./SlideFrame";
import InstructionCard from "./InstructionCard";
import gistStyles from "./GistSlide.module.css";
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

  return (
    <SlideFrame title={title} titleAccent={titleAccent} icon={<HeadphonesIcon />}>
      {hasLines ? (
        <div
          className={gistStyles.instructions}
          style={compact ? { gap: "18px" } : undefined}
        >
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
      ) : null}
    </SlideFrame>
  );
}
