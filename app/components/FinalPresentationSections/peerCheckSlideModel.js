// peerCheckSlideModel.js
// View model for the Partner Check slide. Simple single slide: a header
// (title + time limit) and a dialogue scaffold. No store reads yet — the
// time limit and scaffold are fixed copy for now.
//
// LATER: the time limit (and maybe whether to show the scaffold) will come from
// the peer-check Configure card, like the detail stage's task values.
//
// VIEW MODEL CONTRACT (peerCheck):
//   { title, timeLimit, dialogue: [{ speaker, text }] }

import { PEER_CHECK_SLIDE_COPY as COPY } from "./peerCheckSlideCopy";

export function usePeerCheckSlideModel() {
  return {
    title: COPY.title,
    timeLimit: COPY.timeLimit,
    dialogue: COPY.dialogue,
  };
}
