// DecodeUnscramblePresSection.js
// Full scramble stage as reveal.js slides:
//   [Instructions]
//   per round: [Question] -> [Answer] -> [Pass & erase]   (pass&erase skipped on the last round)
//   [Ending]  (optional — always-on for now; toggle flagged for later)

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { buildScrambleRounds } from "@app/utils/scramblePassage";
import DecodeRoundSlides from "./DecodeRoundSlides";

const DecodeUnscramblePresSection = () => {
  import("@styles/reveal-hedonic.css");

  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const rounds = buildScrambleRounds(comprehensionItems ?? []);

  const allSnippetFileNames = (comprehensionItems ?? []).map(
    (item) => item.snippetFileNames,
  );

  if (rounds.length === 0) return null;

  // TODO(flag): make the ending slide toggle-able via a per-stage config flag
  // on the ScrambleCard. Rendering always-on for now.
  const showEnding = true;

  return (
    <>
      {/* Instructions */}
      <section>
        <h1>Decode &amp; Unscramble</h1>
        <ul>
          <li>Listen to the audio</li>
          <li>Take turns with your partner</li>
          <li>Unscramble the sentence</li>
        </ul>
      </section>

      {rounds.map((round, i) => (
        <DecodeRoundSlides
          key={round.index}
          round={round}
          roundNumber={i + 1}
          allSnippetFileNames={allSnippetFileNames}
          isLast={i === rounds.length - 1}
        />
      ))}

      {/* Optional ending */}
      {showEnding && (
        <section>
          <h2>Well done!</h2>
          <ul>
            <li>Clean the mini whiteboards</li>
            <li>Close your marker</li>
            <li>Pack it up</li>
          </ul>
        </section>
      )}
    </>
  );
};

export default DecodeUnscramblePresSection;
