//Component map for Reveal.js presentation sections
import ThinkPairSharePresSection from "@app/components/FinalPresentationSections/ThinkPairSharePresSection";
import ReadingPresSection from "@app/components/FinalPresentationSections/ReadingPresSection";
import "@app/components/PresentationPrep/CreatePageComponents/StageForms/ReadingForms/readingStages";
import ListeningForGistandDetailPresSection from "@app/components/FinalPresentationSections/ListeningForGistandDetailPresSection";
import VocabularyPresSection from "@app/components/FinalPresentationSections/VocabularyPresSection";

const PresSectionComponentMap = {
  "Think - Pair - Share": ThinkPairSharePresSection,
  // "ReadingForGist": ReadingForGistPresSection,
  // "ReadingForDetail": ReadingForDetailPresSection,
  // "PreReadingVocabulary": PreReadingVocabularySection,
  // "PreReadingGames": PreReadingGamesSection,
  // "FinishReading": FinishReadingSection,
  // "ListeningPrep": ListeningPrepSection,
  "Reading for Gist and Detail": ReadingPresSection,
  "Listening for Gist and Detail": ListeningForGistandDetailPresSection,
  Vocabulary: VocabularyPresSection,
};

export default PresSectionComponentMap;
