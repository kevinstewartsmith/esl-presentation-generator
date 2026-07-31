// themes.js
// The registry of available slide themes. Adding a theme = writing a folder
// that exports a manifest and registering it here. Nothing else changes.

import hedonicTheme from "./hedonic";

export const SLIDE_THEMES = {
  [hedonicTheme.id]: hedonicTheme,
};

export const DEFAULT_THEME_ID = hedonicTheme.id;

// For a theme picker UI later.
export const listSlideThemes = () =>
  Object.values(SLIDE_THEMES).map(({ id, label }) => ({ id, label }));

export const getSlideTheme = (themeId) =>
  SLIDE_THEMES[themeId] ?? SLIDE_THEMES[DEFAULT_THEME_ID];
