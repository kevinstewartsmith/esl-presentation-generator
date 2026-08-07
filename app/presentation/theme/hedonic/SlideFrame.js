// SlideFrame.js
// The chrome every hedonic slide shares: background shapes, the padded canvas,
// and the small header (icon + title + optional subtitle + waveform rules).
// Slide components supply only their body.
//
// Props:
//   title, titleAccent - the heading (accent renders as a colored/emphasis span)
//   subtitle           - optional line BELOW the title (e.g. "1 minute")
//   icon               - optional glyph above the title
//   plainTitle         - when true, the title is a single color (no accent split
//                        styling) — used for dyslexia-friendlier headers
//   inlineIcon         - when true, the icon sits inline beside the title instead
//                        of above it (Partner Check style)

import styles from "./SlideFrame.module.css";
import { MiniWaveform } from "./icons";

export default function SlideFrame({
  title,
  titleAccent,
  subtitle,
  icon,
  plainTitle = false,
  inlineIcon = false,
  children,
}) {
  const titleBlock = (
    <div className={styles.titleRow}>
      {!inlineIcon ? <MiniWaveform className={styles.miniWaveform} /> : null}
      {inlineIcon && icon ? (
        <span className={styles.inlineIcon}>{icon}</span>
      ) : null}
      <h1 className={plainTitle ? styles.plainTitle : undefined}>
        {title}
        {titleAccent ? <span> {titleAccent}</span> : null}
      </h1>
      {!inlineIcon ? <MiniWaveform className={styles.miniWaveform} /> : null}
    </div>
  );

  return (
    <div className={styles.slide}>
      <BackgroundDecoration />

      <header className={styles.header}>
        {icon && !inlineIcon ? (
          <span className={styles.headerIcon}>{icon}</span>
        ) : null}

        {titleBlock}

        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </header>

      <main className={styles.body}>{children}</main>
    </div>
  );
}

function BackgroundDecoration() {
  return (
    <>
      <div className={styles.topLeftShape} />
      <div className={styles.topRightShape} />
      <div className={styles.bottomWaveOne} />
      <div className={styles.bottomWaveTwo} />

      <div className={`${styles.dotGrid} ${styles.dotGridTop}`} />
      <div className={`${styles.dotGrid} ${styles.dotGridBottom}`} />

      <svg
        className={styles.orangeLineTop}
        viewBox="0 0 500 200"
        aria-hidden="true"
      >
        <path
          d="M0 10 C120 140 260 10 500 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>

      <svg
        className={styles.orangeLineBottom}
        viewBox="0 0 500 200"
        aria-hidden="true"
      >
        <path
          d="M0 100 C150 20 260 190 500 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
    </>
  );
}
