// DetailPresSection.js
// Container for the "Listen for Detail" stage. Parts, in order:
//   1. The task-instructions slide (do the exercise in your book).
//   2. Slide-by-slide answer reveal — one slide per REVIEWED question, the answer
//      fading in on the next arrow press (reveal.js fragment). Rendered only when
//      the teacher has "go over slide by slide" on.
//   3. [Phase 2b] A single recap slide with all answers, when "show all answers
//      on one slide" is on. Needs a themed AnswerListSlide — stubbed for now.
//
// Which questions appear + which modes render come from detailConfig (Phase 2).
// Knows Zustand (via the models). Appearance lives in the theme.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useDetailSlideModel } from "./detailSlideModel";
import { useDetailAnswersSlideModel } from "./detailAnswersSlideModel";
import { DETAIL_ANSWERS_SLIDE_COPY as ANSWERS_COPY } from "./detailAnswersSlideCopy";
import { getDetailModes, getQuestionFlags } from "./detailConfigHelpers";

export default function DetailPresSection() {
  const model = useDetailSlideModel();
  const { slides: answerSlides } = useDetailAnswersSlideModel();
  const detailConfig = useAudioTextStore((s) => s.detailConfig);

  const InstructionSlide = useSlideComponent("scrambleInstruction");
  const AnswerRevealSlide = useSlideComponent("answerReveal");
  // Phase 2b: const AnswerListSlide = useSlideComponent("answerList");

  if (!InstructionSlide) return null;

  const modes = getDetailModes(detailConfig);

  // Only questions the teacher kept "review" on. answerSlides are index-aligned
  // with comprehensionItems, so slide i maps to question index i.
  const reviewed = answerSlides.filter(
    (_slide, i) => getQuestionFlags(detailConfig, i).review,
  );

  return (
    <>
      {/* 1. The task instructions */}
      <section className="slide-full">
        <InstructionSlide
          title={model.title}
          titleAccent={model.titleAccent}
          lines={model.lines}
          compact
        />
      </section>

      {/* 2. Slide-by-slide reveal (only reviewed questions, only if mode on) */}
      {modes.showSlideBySlide &&
        AnswerRevealSlide &&
        reviewed.map((slide) => (
          <section key={slide.id} className="slide-full">
            <AnswerRevealSlide
              label={slide.label}
              answerLabel={ANSWERS_COPY.answerAccent}
              question={slide.question}
              answer={slide.answer}
            />
          </section>
        ))}

      {/* 3. Recap-all slide — Phase 2b (needs themed AnswerListSlide).
      {modes.showAllOnOneSlide && AnswerListSlide && reviewed.length > 0 && (
        <section className="slide-full">
          <AnswerListSlide items={reviewed} />
        </section>
      )} */}
    </>
  );
}
