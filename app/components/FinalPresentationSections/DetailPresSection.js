// DetailPresSection.js
// Container for the "Listen for Detail" stage. Parts, in order:
//   1. The task-instructions slide — now with the FULL audio file playable from
//      a play/pause button right of the title (titleAccessory).
//   2. Slide-by-slide answer reveal — one slide per REVIEWED question, answer
//      fading in on arrow. When that question's "play clip" is on, a SnippetPlayer
//      appears with SNIPPET #1 (passages[0]) for that answer. Rendered only when
//      "go over slide by slide" is on.
//   3. A single recap slide listing every reviewed answer, when "show all answers
//      on one slide" is on.
//
// Which questions appear + which modes render come from detailConfig.
// Knows Zustand; appearance is the theme's; the clip player is injected here.

import { useMemo } from "react";
import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import SnippetPlayer from "@app/components/SnippetPlayer";
import { useDetailSlideModel } from "./detailSlideModel";
import { useDetailAnswersSlideModel } from "./detailAnswersSlideModel";
import { DETAIL_ANSWERS_SLIDE_COPY as ANSWERS_COPY } from "./detailAnswersSlideCopy";
import { getDetailModes, getQuestionFlags } from "./detailConfigHelpers";

export default function DetailPresSection() {
  const model = useDetailSlideModel();
  const { slides: answerSlides } = useDetailAnswersSlideModel();
  const detailConfig = useAudioTextStore((s) => s.detailConfig);
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const fullAudioFileName = useAudioTextStore((s) => s.selectedAudioFileName);

  // Detail answer slides play SNIPPET #1 (the primary passage's clip) per answer.
  const snippetFileNames = useMemo(
    () =>
      (comprehensionItems ?? []).map(
        (it) => it.passages?.[0]?.snippetFileName ?? null,
      ),
    [comprehensionItems],
  );

  const InstructionSlide = useSlideComponent("scrambleInstruction");
  const AnswerRevealSlide = useSlideComponent("answerReveal");
  const AnswerListSlide = useSlideComponent("answerList");

  if (!InstructionSlide) return null;

  const modes = getDetailModes(detailConfig);

  // Full audio, playable from the instructions slide (play/pause toggle is
  // built into SnippetPlayer). Only render when we actually have a file.
  const fullAudioPlayer = fullAudioFileName ? (
    <SnippetPlayer index={0} snippetFileNames={[fullAudioFileName]} />
  ) : null;

  // answerSlides are index-aligned with comprehensionItems. Keep original index
  // (for snippet lookup) alongside each reviewed slide.
  const reviewed = answerSlides
    .map((slide, i) => ({ slide, index: i }))
    .filter(({ index }) => getQuestionFlags(detailConfig, index).review);

  return (
    <>
      {/* 1. Task instructions + full-audio player right of the title */}
      <section className="slide-full">
        <InstructionSlide
          title={model.title}
          titleAccent={model.titleAccent}
          lines={model.lines}
          titleAccessory={fullAudioPlayer}
          compact
        />
      </section>

      {/* 2. Slide-by-slide reveal */}
      {modes.showSlideBySlide &&
        AnswerRevealSlide &&
        reviewed.map(({ slide, index }) => {
          const playClip = getQuestionFlags(detailConfig, index).playClip;
          return (
            <section key={slide.id} className="slide-full">
              <AnswerRevealSlide
                label={slide.label}
                answerLabel={ANSWERS_COPY.answerAccent}
                question={slide.question}
                answer={slide.answer}
                player={
                  playClip ? (
                    <SnippetPlayer
                      index={index}
                      snippetFileNames={snippetFileNames}
                    />
                  ) : null
                }
              />
            </section>
          );
        })}

      {/* 3. Recap-all slide */}
      {modes.showAllOnOneSlide && AnswerListSlide && reviewed.length > 0 && (
        <section className="slide-full">
          <AnswerListSlide
            items={reviewed.map(({ slide }) => ({
              id: slide.id,
              question: slide.question,
              answer: slide.answer,
            }))}
          />
        </section>
      )}
    </>
  );
}
