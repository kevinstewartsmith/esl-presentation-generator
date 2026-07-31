// SlideThemeProvider.js
// Resolves a slide TYPE ("gist", "detail", "scramble") to the component the
// ACTIVE THEME uses to render it. Sections ask for a type; the theme decides
// what that looks like. Sections never import a theme component directly.

"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_THEME_ID, getSlideTheme } from "./themes";

const SlideThemeContext = createContext(getSlideTheme(DEFAULT_THEME_ID));

export function SlideThemeProvider({ themeId = DEFAULT_THEME_ID, children }) {
  const theme = useMemo(() => getSlideTheme(themeId), [themeId]);

  return (
    <SlideThemeContext.Provider value={theme}>
      {children}
    </SlideThemeContext.Provider>
  );
}

export const useSlideTheme = () => useContext(SlideThemeContext);

// Returns the component for a slide type, or null if this theme doesn't
// implement it yet. Callers render null rather than crashing the deck — a
// half-finished theme should drop a slide, not break the lesson.
export function useSlideComponent(slideType) {
  const theme = useSlideTheme();
  return theme.slides?.[slideType] ?? null;
}
