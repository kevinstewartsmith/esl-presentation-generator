// GistPresSection.js
// Container for the gist stage. Two slides now:
//   1. the setup slide (listen once / here's the gist question) — now with the
//      FULL audio file playable from a play/pause button right of the title, and
//   2. an answer-reveal slide — the gist answer fades in on the next arrow
//      press (reveal.js fragment), reusing the shared AnswerRevealSlide.
//
// Knows about Zustand (via the model + the audio store for the full-audio file).
// Does not know what the slides look like — the theme owns appearance; the
// player is injected here (an app capability, not a theme concern).
// The answer-reveal slide is only rendered when there's an answer to show.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import SnippetPlayer from "@app/components/SnippetPlayer";
import { useGistSlideModel } from "./gistSlideModel";
import { GIST_SLIDE_COPY as COPY } from "./gistSlideCopy";

export default function GistPresSection() {
  const model = useGistSlideModel();
  const fullAudioFileName = useAudioTextStore((s) => s.selectedAudioFileName);
  const GistSlide = useSlideComponent("gist");
  const AnswerRevealSlide = useSlideComponent("answerReveal");

  // A theme that hasn't implemented the gist slide drops it rather than
  // breaking the deck mid-lesson.
  if (!GistSlide) return null;

  // Full audio, playable from the setup slide (SnippetPlayer toggles play/pause).
  const fullAudioPlayer = fullAudioFileName ? (
    <SnippetPlayer index={0} snippetFileNames={[fullAudioFileName]} />
  ) : null;

  const { answerReveal } = model;
  const showAnswer =
    AnswerRevealSlide && answerReveal && answerReveal.answer.length > 0;

  return (
    <>
      {/* 1. Setup slide + full-audio player right of the title */}
      <section className="slide-full">
        <GistSlide {...model} titleAccessory={fullAudioPlayer} />
      </section>

      {/* 2. Answer reveal — only if there's an answer stored */}
      {showAnswer && (
        <section className="slide-full">
          <AnswerRevealSlide
            label={answerReveal.label}
            answerLabel={COPY.answerAccent}
            question={answerReveal.question}
            answer={answerReveal.answer}
          />
        </section>
      )}
    </>
  );
}
