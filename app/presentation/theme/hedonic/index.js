// hedonic/index.js
// Theme manifest. `canvas` is the logical slide size every stylesheet in this
// theme is drawn against — it must match the width/height passed to
// Reveal.initialize(), or the fixed px sizing will be off.

import GistSlide from "./GistSlide";

const hedonicTheme = {
  id: "hedonic",
  label: "Hedonic",
  canvas: { width: 1280, height: 720 },
  slides: {
    gist: GistSlide,
    // detail: DetailSlide,
    // scramble: ScrambleRoundSlide,
  },
};

export default hedonicTheme;
