// ListeningForGistandDetailPresSection.js
// Level-2 presentation for the Listening for Gist & Detail stage.
// Walks the stage's own slideOrder (from useAudioTextStore) and renders each
// activity's section IN THE TEACHER'S ARRANGED ORDER — the same pattern as the
// StageCard dispatcher, but for reveal.js slides instead of config cards.
//
// This is the clean, slideOrder-driven version (unlike reading, which is still
// hardcoded internally for now). Registered in PresSectionComponentMap under
// "Listening for Gist and Detail".

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
//import DecodeUnscramblePresSection from "./DecodeUnscramblePresSection-legacy";
import GistPresSection from "./GistPresSection";
import DetailPresSection from "./DetailPresSection";
import "@styles/reveal-hedonic.css";
import { SlideThemeProvider } from "@app/presentation/theme/SlideThemeProvider";
// was: import DecodeUnscramblePresSection from "./DecodeUnscramblePresSection";
import ScramblePresSection from "./ScramblePresSection";
import PeerCheckPresSection from "./PeerCheckPresSection"; // ← ADD this line (line 19)
import DetailAnswersPresSection from "./DetailAnswersPresSection";
// activity type -> the section that renders its slides

const SECTION_BY_TYPE = {
  scramble: ScramblePresSection,
  gist: GistPresSection,
  detail: DetailPresSection,
  peerCheck: PeerCheckPresSection,
};

const ListeningForGistandDetailPresSection = () => {
  const slideOrder = useAudioTextStore((s) => s.slideOrder);

  const included = (slideOrder ?? []).filter((it) => it.included);

  return (
    <SlideThemeProvider>
      {included.map((item) => {
        const Section = SECTION_BY_TYPE[item.type];
        return Section ? <Section key={item.id} item={item} /> : null;
      })}
    </SlideThemeProvider>
  );
};

export default ListeningForGistandDetailPresSection;
