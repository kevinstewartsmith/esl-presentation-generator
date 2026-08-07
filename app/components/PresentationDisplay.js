// components/PresentationDisplay.js
"use client";
import { useEffect, useRef } from "react";
import PreReadingVocabularySection from "@app/components/FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import { useReadingStore } from "@app/stores/useReadingStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import GistReadingInstructions from "@app/components/FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "@app/components/FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "@app/components/FinalizedPresentation/PartnerDiscussionSection";
import CancelIcon from "@mui/icons-material/Cancel";
import PresSectionComponentMap from "@app/utils/PresSectionComponentMap";
import { useLessonStore } from "@app/stores/useLessonStore";
import "@styles/reveal-hedonic.css";
import "@styles/reveal-slide-host.css";

const PresentationDisplay = ({ presData, includedStages }) => {
  const revealRef = useRef(null);
  const deckRef = useRef(null);
  const hidePresentation = useLessonStore((s) => s.hidePresentation);

  const included = useReadingStore((state) => state.included);
  const vocabulary = useReadingStore((state) => state.readingVocab);
  const inputTexts = useReadingStore((state) => state.inputTexts);
  const discussionForms = useReadingStore((state) => state.discussionForms);

  // Data that produces fragment slides (answer-reveal). When it changes, the
  // deck must re-sync so reveal registers the newly-rendered fragments.
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (deckRef.current) return; // ← guard: never init twice

    let cancelled = false;

    (async () => {
      const Reveal = (await import("reveal.js")).default;
      const Markdown = (
        await import("reveal.js/plugin/markdown/markdown.esm.js")
      ).default;

      if (cancelled) return;

      const deck = new Reveal(revealRef.current, {
        plugins: [Markdown],
        width: 1280,
        height: 720,
        margin: 0,
        center: false,
        minScale: 0.2,
        maxScale: 2.0,
      });
      await deck.initialize();
      deckRef.current = deck;
      deck.sync();
    })();

    return () => {
      cancelled = true;
      if (deckRef.current) {
        deckRef.current.destroy(); // ← clean up on unmount (kills stale listeners)
        deckRef.current = null;
      }
    };
  }, []);

  // Re-sync whenever the slide content changes (async store hydration), so
  // fragments rendered after init are registered and step correctly.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const t = setTimeout(() => {
      deck.sync();
      deck.layout();
      // Reset the current slide's fragment state so stepping recomputes.
      const { h, v } = deck.getIndices();
      deck.slide(h, v, -1);
    }, 0);

    return () => clearTimeout(t);
  }, [comprehensionItems, includedStages]);

  function renderComponent(componentName) {
    const ComponentToRender = PresSectionComponentMap[componentName]
      ? PresSectionComponentMap[componentName]
      : null;

    if (!ComponentToRender) {
      return <div>Component not found</div>;
    }
    return <ComponentToRender />;
  }

  return (
    <div
      className="reveal"
      ref={revealRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <button onClick={hidePresentation} className="presentation-cancel-button">
        <CancelIcon
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </button>
      <div className="slides">
        {includedStages.map((stage, index) => {
          if (stage !== "Start Presentation") {
            return renderComponent(stage, index);
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default PresentationDisplay;
