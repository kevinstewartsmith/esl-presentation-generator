// sectionLabels.js
// Skill-agnostic labels + skill tokens for the GENERALIZED create-page shell.
// One source of truth so the Arrange page, the Configure page, and any future
// skill all show the right kicker instead of hardcoding "Listening". When a new
// skill is added, add its two lines here — not in each shared component.

// Full section id (its name) -> short skill token, used to filter the Bag of
// tricks. Unknown ids fall back to the first word, lowercased.
export const SECTION_SKILL = {
  "Listening for Gist and Detail": "listening",
  "Reading for Gist and Detail": "reading",
  Vocabulary: "vocabulary",
};

export const skillTokenFor = (sectionId) =>
  SECTION_SKILL[sectionId] ||
  (sectionId || "").trim().split(" ")[0].toLowerCase();

// Full section id -> the kicker shown above the page title. Falls back to the
// raw section id so a new skill is never mislabelled "Listening".
export const SECTION_KICKER = {
  "Listening for Gist and Detail": "Listening · Gist & Detail",
  "Reading for Gist and Detail": "Reading · Gist & Detail",
  Vocabulary: "Vocabulary",
};

export const kickerFor = (sectionId) =>
  SECTION_KICKER[sectionId] ?? sectionId ?? "";
