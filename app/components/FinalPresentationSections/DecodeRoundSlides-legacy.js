// DecodeRoundSlides.js
// One scramble round as flat sequential slides (right-arrow):
//   [Question: play + scrambled] -> [Answer: replay + passage] -> [Pass & erase]
// The pass-and-erase slide is skipped on the last round (isLast), since the
// stage ends with the optional wrap-up slide instead.

import SnippetPlayer from "@app/components/SnippetPlayer";

export default function DecodeRoundSlides({
  round,
  roundNumber,
  allSnippetFileNames,
  isLast,
}) {
  return (
    <>
      {/* Question — the task */}
      <section key={`decode-task-${round.index}`}>
        <h2>Round {roundNumber}</h2>
        <div style={styles.playWrap}>
          <SnippetPlayer index={round.index} snippetFileNames={allSnippetFileNames} />
        </div>
        <p style={styles.scrambled}>{round.scrambled}</p>
      </section>

      {/* Answer */}
      <section key={`decode-answer-${round.index}`}>
        <h2>Round {roundNumber} — Answer</h2>
        <div style={styles.playWrap}>
          <SnippetPlayer index={round.index} snippetFileNames={allSnippetFileNames} />
        </div>
        <p style={styles.answer}>{round.passage}</p>
      </section>

      {/* Pass & erase — between rounds only (not after the last) */}
      {!isLast && (
        <section key={`decode-pass-${round.index}`}>
          <h2>Erase and pass the board!</h2>
        </section>
      )}
    </>
  );
}

const styles = {
  playWrap: { display: "flex", justifyContent: "center", margin: "1rem 0 1.5rem" },
  scrambled: { fontSize: "1.5em", lineHeight: 1.6, fontWeight: 600 },
  answer: { fontSize: "1.5em", lineHeight: 1.6 },
};
