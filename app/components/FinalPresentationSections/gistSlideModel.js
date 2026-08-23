// gistSlideModel.js
// The ONLY place that knows both the store shape and the slide contract.
//
// VIEW MODEL CONTRACT (gist):
//   {
//     title:       string
//     titleAccent: string | undefined   // rendered in the accent colour
//     steps: [
//       {
//         id:    string
//         role:  "listen" | "answer"    // SEMANTIC — never a colour or icon
//         label: string                 // the large line
//         body?: string                 // secondary line (the question text)
//       }
//     ]
//     // For the follow-up answer-reveal slide (fragment reveal):
//     answerReveal: {
//       label:    string   // slide heading
//       question: string
//       answer:   string   // "" when the teacher hasn't got an answer stored
//     }
//   }
//
// Themes consume this and nothing else.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { GIST_SLIDE_COPY as COPY } from "./gistSlideCopy";

export function useGistSlideModel() {
  const selectedGist = useAudioTextStore((s) => s.selectedGist);

  const question = selectedGist?.question?.trim() || COPY.questionFallback;
  const answer = selectedGist?.answer?.trim() || "";

  return {
    title: COPY.title,
    titleAccent: COPY.titleAccent,
    steps: [
      {
        id: "listen",
        role: "listen",
        label: COPY.listenLabel,
      },
      {
        id: "answer",
        role: "answer",
        label: COPY.answerLabel,
        body: question,
      },
    ],
    answerReveal: {
      label: COPY.answerRevealLabel,
      question,
      answer,
    },
  };
}
