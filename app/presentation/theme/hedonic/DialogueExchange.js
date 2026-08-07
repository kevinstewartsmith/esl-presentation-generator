// DialogueExchange.js  (hedonic theme)
// Renders a speaking scaffold as an A/B dialogue: speaker A's line in a blue
// bubble aligned left, speaker B's in an orange bubble aligned right, each with
// an avatar. Pure presentational — it receives the lines and draws them.
//
// A "___" blank in a line is highlighted so students see it's a slot to fill.

import styles from "./DialogueExchange.module.css";

function renderWithBlank(text) {
  // Highlight a "___" placeholder if present.
  const parts = text.split(/(_{2,})/g);
  return parts.map((part, i) =>
    /_{2,}/.test(part) ? (
      <span key={i} className={styles.blank}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function DialogueExchange({ dialogue = [] }) {
  return (
    <div className={styles.wrap}>
      {dialogue.map((line, i) => {
        const isA = (line.speaker ?? (i === 0 ? "A" : "B")) === "A";
        return (
          <div
            key={i}
            className={`${styles.row} ${isA ? styles.left : styles.right}`}
          >
            <div className={`${styles.bubble} ${isA ? styles.bubbleA : styles.bubbleB}`}>
              <div className={`${styles.avatar} ${isA ? styles.avatarA : styles.avatarB}`}>
                {line.speaker ?? (isA ? "A" : "B")}
              </div>
              <span className={styles.text}>{renderWithBlank(line.text)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
