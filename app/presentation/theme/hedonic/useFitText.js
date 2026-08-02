// useFitText.js
// Shrinks font-size until the element fits its box (height AND width). Steps
// down from a max until scrollHeight/scrollWidth fit, so a long scrambled
// sentence scales down instead of overflowing. Re-runs when `text` changes.
//
// Lives in the theme layer — fitting text to a slide box is a presentation
// concern.

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitText(text, { max = 96, min = 24, step = 2 } = {}) {
  const ref = useRef(null);
  const [size, setSize] = useState(max);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let current = max;
    el.style.fontSize = `${current}px`;

    // Shrink until it fits or we hit the floor.
    while (
      current > min &&
      (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)
    ) {
      current -= step;
      el.style.fontSize = `${current}px`;
    }

    setSize(current);
  }, [text, max, min, step]);

  return { ref, size };
}
