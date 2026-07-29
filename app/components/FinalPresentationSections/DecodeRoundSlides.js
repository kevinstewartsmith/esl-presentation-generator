// DecodeRoundSlides.js
// The two slides for ONE scramble round, as a reveal.js vertical stack:
//   Slide A: play button + scrambled words (students unscramble on whiteboards)
//   Slide B: the answer (correct order)
//
// A <section> containing two <section>s = a vertical slide group in reveal.js,
// so the teacher goes DOWN from the task to the answer, then RIGHT to the next
// round. Matches the agreed Slide A -> Slide B -> next flow.

import SnippetPlayer from "@app/components/SnippetPlayer";

export default function DecodeRoundSlides({ round, roundNumber }) {
  return (
    <section>
      {/* Slide A — the task */}
      <section>
        <h2>Round {roundNumber}</h2>

        <div style={styles.playWrap}>
          {/* Each round has its own single-item array, so index 0. */}
          <SnippetPlayer index={0} snippetFileNames={round.snippetFileNames} />
        </div>

        <p style={styles.scrambled}>{round.scrambled}</p>

        <p style={styles.hint}>Unscramble with your partner.</p>
      </section>

      {/* Slide B — the answer */}
      <section>
        <h2>Round {roundNumber} — Answer</h2>
        <p style={styles.answer}>{round.answer}</p>
      </section>
    </section>
  );
}

const styles = {
  playWrap: { display: "flex", justifyContent: "center", margin: "1rem 0 1.5rem" },
  scrambled: { fontSize: "1.5em", lineHeight: 1.6, fontWeight: 600 },
  hint: { fontSize: "0.7em", opacity: 0.7, marginTop: "1.5rem" },
  answer: { fontSize: "1.5em", lineHeight: 1.6 },
};
