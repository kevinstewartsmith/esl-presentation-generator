// stageRegistry.js
// Lets a skill register its BESPOKE stage cards + pres sections without the
// shared dispatchers importing skill-specific code. The dispatchers check the
// registry first, then fall back to their built-in maps — so listening's
// hardcoded stages stay as they are, and reading (and future skills) plug in
// cleanly with zero _shared -> skill imports.
//
// A skill registers from a side-effect module (e.g. ReadingForms/readingStages.js),
// imported where that skill is wired: ComponentMap (Configure) + PresSectionComponentMap (deck).
const cardRegistry = {};
const presRegistry = {};

export const registerStageCard = (type, Card) => {
  cardRegistry[type] = Card;
};
export const registerStagePresSection = (type, Section) => {
  presRegistry[type] = Section;
};
export const getRegisteredStageCard = (type) => cardRegistry[type];
export const getRegisteredStagePresSection = (type) => presRegistry[type];
