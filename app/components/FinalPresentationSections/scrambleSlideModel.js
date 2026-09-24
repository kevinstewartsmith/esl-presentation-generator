// scrambleSlideModel.js
// The ONLY place that knows both the store shape and the scramble slide
// contract. Unlike gist (one slide), scramble is a SEQUENCE, so the model
// returns an ORDERED ARRAY of slide view-models.
//
// MULTI-PASSAGE: one round per SELECTED passage (from scrambleConfig), not one
// per question. Each round carries its OWN clip filename, so the section plays
// the right passage's audio.
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
//     snippetFileName?: string | null  // the clip this round plays
//   }
//
// `kind` is SEMANTIC. The theme decides what each kind looks like. The clip
// filename rides on the slide; the section builds the player — see
// ScramblePresSection.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import { getScramblePassageFlag } from "./scrambleConfigHelpers";
import { SCRAMBLE_SLIDE_COPY as COPY } from "./scrambleSlideCopy";

export function useScrambleSlideModel({ showEnding = true } = {}) {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const scrambleConfig = useAudioTextStore((s) => s.scrambleConfig);

  const rounds = buildScrambleRounds(comprehensionItems ?? [], {
    isSelected: (q, p) =>
      getScramblePassageFlag(scrambleConfig, q, p).include,
  });

  if (rounds.length === 0) {
    return { slides: [] };
  }

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
    const key = `${round.questionIndex}-${round.passageIndex}`;

    slides.push({
      id: `q-${key}`,
      kind: "question",
      title: label,
      scrambled: round.scrambled,
      hint: COPY.unscrambleHint,
      snippetFileName: round.snippetFileName,
    });

    slides.push({
      id: `a-${key}`,
      kind: "answer",
      title: label,
      titleAccent: COPY.answerAccent,
      passage: round.passage,
      snippetFileName: round.snippetFileName,
    });

    if (!isLast) {
      slides.push({
        id: `pass-${key}`,
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

  return { slides };
}
