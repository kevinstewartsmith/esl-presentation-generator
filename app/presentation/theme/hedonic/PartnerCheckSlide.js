// PartnerCheckSlide.js  (hedonic theme)
// The full Partner Check slide: SlideFrame header (users icon inline + single-
// color title + "1 minute" subtitle) with the A/B dialogue scaffold in the body.
// Pure presentational — composes SlideFrame + DialogueExchange.

import SlideFrame from "./SlideFrame";
import DialogueExchange from "./DialogueExchange";
import { UsersIcon } from "./icons";

export default function PartnerCheckSlide({ title, timeLimit, dialogue }) {
  return (
    <SlideFrame
      title={title}
      subtitle={timeLimit}
      icon={<UsersIcon />}
      plainTitle
      inlineIcon
    >
      <DialogueExchange dialogue={dialogue} />
    </SlideFrame>
  );
}
