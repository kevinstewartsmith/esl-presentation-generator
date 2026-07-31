// SlideFrame.js
// The chrome every hedonic slide shares: the background shapes, the padded
// canvas, and the small header (icon + title + waveform rules). Slide
// components supply only their body. Detail and scramble slides reuse this,
// which is what keeps the deck visually consistent for free.

import styles from "./SlideFrame.module.css";
import { MiniWaveform } from "./icons";

export default function SlideFrame({ title, titleAccent, icon, children }) {
  return (
    <div className={styles.slide}>
      <BackgroundDecoration />

      <header className={styles.header}>
        {icon ? <span className={styles.headerIcon}>{icon}</span> : null}

        <div className={styles.titleRow}>
          <MiniWaveform className={styles.miniWaveform} />
          <h1>
            {title}
            {titleAccent ? <span> {titleAccent}</span> : null}
          </h1>
          <MiniWaveform className={styles.miniWaveform} />
        </div>
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
