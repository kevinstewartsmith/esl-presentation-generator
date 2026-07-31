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
//   }
//
// Themes consume this and nothing else. If a theme needs something new, add it
// here as a role or a field — never by importing the store into a theme.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { GIST_SLIDE_COPY as COPY } from "./gistSlideCopy";

export function useGistSlideModel() {
  const selectedGist = useAudioTextStore((s) => s.selectedGist);

  const question = selectedGist?.question?.trim() || COPY.questionFallback;

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
  };
}
