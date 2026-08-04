// InstructionCard.js
// One numbered instruction block. `tone` is a theme-internal concept ("primary"
// / "accent") — the view model passes semantic roles and the slide maps them,
// so content never names a colour.

import styles from "./InstructionCard.module.css";

export default function InstructionCard({
  tone = "primary",
  number,
  label,
  italicLabel = false,
  icon,
  decoration,
  compact = false,
  children,
}) {
  const toneClass = tone === "accent" ? styles.accentCard : styles.primaryCard;

  return (
    <div
      className={`${styles.card} ${tone === "accent" ? styles.accentCard : styles.primaryCard} ${compact ? styles.compact : ""}`}
    >
      <div className={styles.iconArea}>
        <div className={styles.iconCircle}>{icon}</div>
        <div className={styles.divider} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.instructionHeading}>
          {number ? <span className={styles.number}>{number}</span> : null}
          <span className={italicLabel ? styles.italicLabel : styles.label}>
            {label}
          </span>
        </div>

        {children ? <div className={styles.question}>{children}</div> : null}
      </div>

      {decoration ? (
        <div className={styles.cardDecoration}>{decoration}</div>
      ) : null}
    </div>
  );
}
