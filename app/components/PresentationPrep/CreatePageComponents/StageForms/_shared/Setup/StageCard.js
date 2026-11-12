// StageCard.js
// Dispatcher: given a slideOrder item, render the card for its type.
// Same idea as ComponentMap / PresSectionComponentMap — add a new stage type
// by adding a card file and one entry here. ConfigureStageDetails never changes.

"use client";

import ScrambleCard from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetailForms/StageCards/ScrambleCard";
import GistCard from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetailForms/StageCards/GistCard";
import DetailCard from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetailForms/StageCards/DetailCard";
import PlaceholderCard from "./Cards/PlaceholderCard";
import { getRegisteredStageCard } from "./stageRegistry";
import WarmupActivityCard from "./Cards/WarmupActivityCard";
import StandaloneHotSeatCard from "./Cards/StandaloneHotSeatCard";

const CARD_BY_TYPE = {
  scramble: ScrambleCard,
  gist: GistCard,
  detail: DetailCard,
  warmUp: WarmupActivityCard,
  leadIn: WarmupActivityCard,
  hotSeat: StandaloneHotSeatCard,
};

export default function StageCard({ item, position }) {
  const Card =
    getRegisteredStageCard(item.type) ?? CARD_BY_TYPE[item.type] ?? PlaceholderCard;
  return <Card item={item} position={position} />;
}
