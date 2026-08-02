// scrambleSlideModel.js
// The ONLY place that knows both the store shape and the scramble slide
// contract. Unlike gist (one slide), scramble is a SEQUENCE, so the model
// returns an ORDERED ARRAY of slide view-models.
//
// VIEW MODEL CONTRACT (scramble): an array of slides, each:
//   {
//     id:    string
//     kind:  "instructions" | "question" | "answer" | "pass" | "ending"
//     title?:       string
//     titleAccent?: string
//     lines?:       string[]           // instructions / ending bullet lines
//     scrambled?:   string             // question slide
//     passage?:     string             // answer slide
//     hint?:        string             // question slide
//     snippetIndex?: number            // which snippet this round plays
//   }
//
// `kind` is SEMANTIC. The theme decides what each kind looks like. Snippet
// filenames are passed alongside the model (audio is an app capability, not a
// theme concern) — see ScramblePresSection.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import { SCRAMBLE_SLIDE_COPY as COPY } from "./scrambleSlideCopy";

export function useScrambleSlideModel({ showEnding = true } = {}) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const rounds = buildScrambleRounds(comprehensionItems ?? []);

  if (rounds.length === 0) {
    return { slides: [], allSnippetFileNames: [] };
  }

  const allSnippetFileNames = (comprehensionItems ?? []).map(
    (item) => item.snippetFileNames,
  );

  const slides = [];

  // Instructions
  slides.push({
    id: "instructions",
    kind: "instructions",
    title: COPY.title,
    titleAccent: COPY.titleAccent,
    lines: COPY.instructions,
  });

  // Per round: question -> answer -> (pass, except after the last round)
  rounds.forEach((round, i) => {
    const isLast = i === rounds.length - 1;
    const label = COPY.roundLabel(i + 1);

    slides.push({
      id: `q-${round.index}`,
      kind: "question",
      title: label,
      scrambled: round.scrambled,
      hint: COPY.unscrambleHint,
      snippetIndex: round.index,
    });

    slides.push({
      id: `a-${round.index}`,
      kind: "answer",
      title: label,
      titleAccent: COPY.answerAccent,
      passage: round.passage,
      snippetIndex: round.index,
    });

    if (!isLast) {
      slides.push({
        id: `pass-${round.index}`,
        kind: "pass",
        title: COPY.passLabel,
      });
    }
  });

  // Optional ending
  if (showEnding) {
    slides.push({
      id: "ending",
      kind: "ending",
      title: COPY.endingTitle,
      lines: COPY.ending,
    });
  }

  return { slides, allSnippetFileNames };
}
