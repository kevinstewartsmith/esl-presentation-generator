// scrambleSlideCopy.js
// Instructional wording for the scramble (decode & unscramble) stage.
// Same rationale as gistSlideCopy: not store data, not theme data — task
// wording lives here so it changes in one place.

export const SCRAMBLE_SLIDE_COPY = {
  title: "Decode",
  titleAccent: "& unscramble",

  // Instructions slide
  instructions: [
    "Listen to the audio",
    "Take turns with your partner",
    "Unscramble the sentence",
  ],

  // Per-round labels
  roundLabel: (n) => `Round ${n}`,
  answerAccent: "— answer",
  unscrambleHint: "Unscramble with your partner.",

  // Between-rounds slide
  passLabel: "Erase and pass the board!",

  // Optional ending slide
  endingTitle: "Well done!",
  ending: ["Clean the mini whiteboards", "Close your marker", "Pack it up"],
};
