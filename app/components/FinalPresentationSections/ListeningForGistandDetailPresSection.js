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
import DecodeUnscramblePresSection from "./DecodeUnscramblePresSection";
import GistPresSection from "./GistPresSection";
import DetailPresSection from "./DetailPresSection";

// activity type -> the section that renders its slides
const SECTION_BY_TYPE = {
  scramble: DecodeUnscramblePresSection,
  gist: GistPresSection,
  detail: DetailPresSection,
};

const ListeningForGistandDetailPresSection = () => {
  import("@styles/reveal-hedonic.css");

  const slideOrder = useAudioTextStore((s) => s.slideOrder);

  const included = (slideOrder ?? []).filter((it) => it.included);

  return (
    <>
      {included.map((item) => {
        const Section = SECTION_BY_TYPE[item.type];
        return Section ? <Section key={item.id} item={item} /> : null;
      })}
    </>
  );
};

export default ListeningForGistandDetailPresSection;
