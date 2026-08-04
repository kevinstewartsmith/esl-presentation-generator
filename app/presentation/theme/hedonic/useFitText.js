// useFitText.js
// Shrinks font-size until the text fits its container (both dimensions). Runs
// after layout via requestAnimationFrame so the box has real measurements, and
// re-runs on resize. Lives in the theme layer.

import { useEffect, useLayoutEffect, useRef } from "react";

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitText(text, { max = 88, min = 22, step = 2 } = {}) {
  const ref = useRef(null);

  useIso(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;

      // Available box = the flex slot this text lives in.
      const availH = parent.clientHeight;
      const availW = parent.clientWidth;
      if (availH === 0 || availW === 0) {
        raf = requestAnimationFrame(fit); // layout not ready yet — retry
        return;
      }

      let current = max;
      el.style.fontSize = `${current}px`;

      while (
        current > min &&
        (el.scrollHeight > availH || el.scrollWidth > availW)
      ) {
        current -= step;
        el.style.fontSize = `${current}px`;
      }
    };

    raf = requestAnimationFrame(fit);

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    });
    if (el.parentElement) ro.observe(el.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text, max, min, step]);

  return { ref };
}
