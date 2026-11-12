// readingStages.js
// Side-effect module: registers Reading's bespoke stages into the shared
// stageRegistry so the Configure dispatcher (StageCard) and the deck renderer
// can find them without importing reading code directly. Imported for its side
// effect by ComponentMap (Configure) and PresSectionComponentMap (deck).
import {
  registerStageCard,
  registerStagePresSection,
} from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/stageRegistry";
import GistReadingCard from "./StageCards/GistReadingCard";
import GistReadingPresSection from "@app/components/FinalPresentationSections/GistReadingPresSection";

registerStageCard("gistReading", GistReadingCard);
registerStagePresSection("gistReading", GistReadingPresSection);
