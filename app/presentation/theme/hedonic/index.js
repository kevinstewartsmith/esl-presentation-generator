// hedonic/index.js
// Theme manifest. `canvas` is the logical slide size every stylesheet in this
// theme is drawn against — it must match the width/height passed to
// Reveal.initialize(), or the fixed px sizing will be off.

import GistSlide from "./GistSlide";
import InstructionSlide from "./InstructionSlide";
import ScrambleRoundSlide from "./ScrambleRoundSlide";
import StatementSlide from "./StatementSlide";
import PartnerCheckSlide from "./PartnerCheckSlide";

const hedonicTheme = {
  id: "hedonic",
  label: "Hedonic",
  canvas: { width: 1280, height: 720 },
  slides: {
    gist: GistSlide,
    scrambleInstruction: InstructionSlide,
    scrambleRound: ScrambleRoundSlide,
    scrambleStatement: StatementSlide,
    partnerCheck: PartnerCheckSlide,
    detail: InstructionSlide,
  },
};

export default hedonicTheme;
