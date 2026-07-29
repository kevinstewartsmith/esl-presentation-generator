// DecodeUnscramblePresSection.js
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

  return (
    <>
      <section>
        <h1>Decode &amp; Unscramble</h1>
        <p>Listen to the audio.</p>
        <p>Unscramble the words with your partner on your whiteboard.</p>
      </section>

      {rounds.map((round, i) => (
        <DecodeRoundSlides
          key={round.index}
          round={round}
          roundNumber={i + 1}
          allSnippetFileNames={allSnippetFileNames}
        />
      ))}
    </>
  );
};

export default DecodeUnscramblePresSection;
