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
import DetailReadingCard from "./StageCards/DetailReadingCard";
import PartnerDiscussionCard from "./StageCards/PartnerDiscussionCard";
import GistReadingPresSection from "@app/components/FinalPresentationSections/GistReadingPresSection";
import DetailReadingPresSection from "@app/components/FinalPresentationSections/DetailReadingPresSection";
import PartnerDiscussionPresSection from "@app/components/FinalPresentationSections/PartnerDiscussionPresSection";

registerStageCard("gistReading", GistReadingCard);
registerStagePresSection("gistReading", GistReadingPresSection);
registerStageCard("detailReading", DetailReadingCard);
registerStagePresSection("detailReading", DetailReadingPresSection);
registerStageCard("partnerDiscussion", PartnerDiscussionCard);
registerStagePresSection("partnerDiscussion", PartnerDiscussionPresSection);
