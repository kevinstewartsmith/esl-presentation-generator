// VocabularyPresSection.js
// The Vocabulary skill's level-2 presentation (registered in
// PresSectionComponentMap under "Vocabulary").
//
// The stage machinery (slideOrder, warm-ups, Hot Seat, lead-ins) is SHARED with
// listening, so for now the vocab deck is the exact same slideOrder-driven run:
// this file just re-exports that renderer under a vocab name. It gives us a
// clean seam to split off vocab-specific slides later without touching the map.
export { default } from "./ListeningForGistandDetailPresSection";
