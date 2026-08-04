// ScramblePresSection.js  (replaces DecodeUnscramblePresSection.js)
// Container for the scramble stage. Like GistPresSection, but the model is an
// ARRAY of slides, so it maps each one to the active theme's component and
// renders each in its own reveal <section>.
//
// Knows Zustand + the SnippetPlayer (app capabilities). Does NOT know what any
// slide looks like — the theme owns appearance.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useScrambleSlideModel } from "./scrambleSlideModel";
import SnippetPlayer from "@app/components/SnippetPlayer";

const ScramblePresSection = () => {
  import("@styles/reveal-hedonic.css");

  const { slides, allSnippetFileNames } = useScrambleSlideModel();

  const InstructionSlide = useSlideComponent("scrambleInstruction");
  const RoundSlide = useSlideComponent("scrambleRound");
  const StatementSlide = useSlideComponent("scrambleStatement");
  // A theme that hasn't implemented these drops the stage rather than crashing.
  if (!InstructionSlide || !RoundSlide) return null;
  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide) => {
        switch (slide.kind) {
          case "instructions":
            return (
              <section key={slide.id} className="slide-full">
                <InstructionSlide
                  title={slide.title}
                  titleAccent={slide.titleAccent}
                  lines={slide.lines}
                  compact
                />
              </section>
            );

          case "pass":
            return (
              <section key={slide.id} className="slide-full">
                <StatementSlide text={slide.title} />
              </section>
            );

          case "ending":
            return (
              <section key={slide.id} className="slide-full">
                <InstructionSlide
                  title={slide.title}
                  lines={slide.lines}
                  numbered={false}
                  allPrimary
                />
              </section>
            );

          case "question":
            return (
              <section key={slide.id} className="slide-full">
                <RoundSlide
                  variant="question"
                  title={slide.title}
                  text={slide.scrambled}
                  hint={slide.hint}
                  player={
                    <SnippetPlayer
                      index={slide.snippetIndex}
                      snippetFileNames={allSnippetFileNames}
                    />
                  }
                />
              </section>
            );

          case "answer":
            return (
              <section key={slide.id} className="slide-full">
                <RoundSlide
                  variant="answer"
                  title={slide.title}
                  titleAccent={slide.titleAccent}
                  text={slide.passage}
                  player={
                    <SnippetPlayer
                      index={slide.snippetIndex}
                      snippetFileNames={allSnippetFileNames}
                    />
                  }
                />
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default ScramblePresSection;
