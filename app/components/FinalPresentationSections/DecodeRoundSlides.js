// DecodeRoundSlides.js
// The two slides for ONE scramble round, as FLAT SEQUENTIAL slides (right-arrow):
//   Slide A: play button + scrambled words
//   Slide B: play button (replay) + the passage in natural order (the answer)
//
// The two <section>s are keyed so React doesn't warn about missing keys when
// this component is used inside a .map().

import SnippetPlayer from "@app/components/SnippetPlayer";

export default function DecodeRoundSlides({
  round,
  roundNumber,
  allSnippetFileNames,
}) {
  return (
    <>
      {/* Slide A — the task */}
      <section key={`decode-task-${round.index}`}>
        <h2>Round {roundNumber}</h2>

        <div style={styles.playWrap}>
          <SnippetPlayer
            index={round.index}
            snippetFileNames={allSnippetFileNames}
          />
        </div>

        <p style={styles.scrambled}>{round.scrambled}</p>
        <p style={styles.hint}>Unscramble with your partner.</p>
      </section>

      {/* Slide B — the answer */}
      <section key={`decode-answer-${round.index}`}>
        <h2>Round {roundNumber} — Answer</h2>

        <div style={styles.playWrap}>
          <SnippetPlayer
            index={round.index}
            snippetFileNames={allSnippetFileNames}
          />
        </div>

        <p style={styles.answer}>{round.passage}</p>
      </section>
    </>
  );
}

const styles = {
  playWrap: {
    display: "flex",
    justifyContent: "center",
    margin: "1rem 0 1.5rem",
  },
  scrambled: { fontSize: "1.5em", lineHeight: 1.6, fontWeight: 600 },
  hint: { fontSize: "0.7em", opacity: 0.7, marginTop: "1.5rem" },
  answer: { fontSize: "1.5em", lineHeight: 1.6 },
};
