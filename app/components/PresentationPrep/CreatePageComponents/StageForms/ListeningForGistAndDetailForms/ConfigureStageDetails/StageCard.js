// StageCard.js
// Dispatcher: given a slideOrder item, render the card for its type.
// Same idea as ComponentMap / PresSectionComponentMap — add a new stage type
// by adding a card file and one entry here. ConfigureStageDetails never changes.

"use client";

import ScrambleCard from "./cards/ScrambleCard";
import GistCard from "./cards/GistCard";
import DetailCard from "./cards/DetailCard";
import PlaceholderCard from "./cards/PlaceholderCard";
import WarmupActivityCard from "./cards/WarmupActivityCard";

const CARD_BY_TYPE = {
  scramble: ScrambleCard,
  gist: GistCard,
  detail: DetailCard,
  warmUp: WarmupActivityCard,
  leadIn: WarmupActivityCard,
};

export default function StageCard({ item, position }) {
  const Card = CARD_BY_TYPE[item.type] ?? PlaceholderCard;
  return <Card item={item} position={position} />;
}
