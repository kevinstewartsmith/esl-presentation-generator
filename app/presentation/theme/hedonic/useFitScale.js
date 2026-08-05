// useFitScale.js
// Scales an element down (transform: scale) until it fits its parent box in
// BOTH dimensions. Unlike useFitText (which changes font-size on one text node),
// this shrinks a whole subtree uniformly — ideal for an instruction-card stack
// that must fit the slide body regardless of how many cards it has.
//
// Runs after layout (rAF) and re-fits on resize. Lives in the theme layer.

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitScale(dep, { max = 1, min = 0.4 } = {}) {
  const ref = useRef(null);
  const [scale, setScale] = useState(max);

  useIso(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;

      const availH = parent.clientHeight;
      const availW = parent.clientWidth;
      if (availH === 0 || availW === 0) {
        raf = requestAnimationFrame(fit);
        return;
      }

      // Measure the element at natural size (scale 1) first.
      el.style.transform = "scale(1)";
      const needH = el.scrollHeight;
      const needW = el.scrollWidth;

      const ratio = Math.min(availH / needH, availW / needW, max);
      const next = Math.max(min, ratio);

      el.style.transform = `scale(${next})`;
      setScale(next);
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
  }, [dep, max, min]);

  return { ref, scale };
}
