//Component map for Reveal.js presentation sections
import ThinkPairSharePresSection from "@app/components/FinalPresentationSections/ThinkPairSharePresSection";
import ReadingForGistandDetailPresSection from "@app/components/FinalPresentationSections/ReadingForGistandDetailPresSection";
import ListeningForGistandDetailPresSection from "@app/components/FinalPresentationSections/ListeningForGistandDetailPresSection";

const PresSectionComponentMap = {
  "Think - Pair - Share": ThinkPairSharePresSection,
  // "ReadingForGist": ReadingForGistPresSection,
  // "ReadingForDetail": ReadingForDetailPresSection,
  // "PreReadingVocabulary": PreReadingVocabularySection,
  // "PreReadingGames": PreReadingGamesSection,
  // "FinishReading": FinishReadingSection,
  // "ListeningPrep": ListeningPrepSection,
  "Reading for Gist and Detail": ReadingForGistandDetailPresSection,
  "Listening for Gist and Detail": ListeningForGistandDetailPresSection,
};

export default PresSectionComponentMap;
