// PeerCheckPresSection.js
// Container for the Partner Check stage. Single slide. Knows Zustand (via the
// model); appearance lives in the theme's PartnerCheckSlide.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { usePeerCheckSlideModel } from "./peerCheckSlideModel";

export default function PeerCheckPresSection() {
  const model = usePeerCheckSlideModel();
  const PartnerCheckSlide = useSlideComponent("partnerCheck");

  if (!PartnerCheckSlide) return null;

  return (
    <section className="slide-full">
      <PartnerCheckSlide
        title={model.title}
        timeLimit={model.timeLimit}
        dialogue={model.dialogue}
      />
    </section>
  );
}
