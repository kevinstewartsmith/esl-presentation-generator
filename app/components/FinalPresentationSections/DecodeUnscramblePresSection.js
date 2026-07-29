// DecodeUnscramblePresSection.js
// Renders the decode/unscramble game as reveal.js slides.
//
// Derives the scramble rounds the SAME way ConfigureStageDetails' ScrambleCard
// does (buildScrambleRounds on the comprehension items), so the slides match
// exactly what the teacher saw and configured. [Later: read persisted/edited
// scrambles from item.variations.scramble instead of re-deriving — Option B.]
//
// Per included round: two slides (a vertical stack in reveal.js) —
//   Slide A: instructions + snippet play button + scrambled words
//   Slide B: the answer (correct order)
//
// Follows the existing PresSection conventions: renders <section> elements,
// pulls from the store, reuses SnippetPlayer.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import DecodeRoundSlides from "./DecodeRoundSlides";

const DecodeUnscramblePresSection = () => {
  import("@styles/reveal-hedonic.css");

  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const rounds = buildScrambleRounds(comprehensionItems ?? []);

  if (rounds.length === 0) return null;

  return (
    <>
      {/* Intro slide for the whole game */}
      <section>
        <h1>Decode &amp; Unscramble</h1>
        <p>Listen to the audio.</p>
        <p>Unscramble the words with your partner on your whiteboard.</p>
      </section>

      {rounds.map((round, i) => (
        <DecodeRoundSlides key={round.index} round={round} roundNumber={i + 1} />
      ))}
    </>
  );
};

export default DecodeUnscramblePresSection;
