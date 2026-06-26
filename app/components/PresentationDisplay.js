// components/PresentationDisplay.js
"use client";
import { useEffect, useRef, useContext } from "react";
import PreReadingVocabularySection from "@app/components/FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import { useReadingStore } from "@app/stores/useReadingStore";
import GistReadingInstructions from "@app/components/FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "@app/components/FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "@app/components/FinalizedPresentation/PartnerDiscussionSection";
import CancelIcon from "@mui/icons-material/Cancel";
import PresSectionComponentMap from "@app/utils/PresSectionComponentMap";

const PresentationDisplay = ({ presData, includedStages }) => {
  import("@styles/reveal-hedonic.css");

  const revealRef = useRef(null);

  const { sliders, textBoxInputs } = useContext(PresentationContext);
  const { hidePresentation } = useContext(GlobalVariablesContext);

  const included = useReadingStore((state) => state.included);
  const vocabulary = useReadingStore((state) => state.readingVocab);
  const inputTexts = useReadingStore((state) => state.inputTexts);
  const discussionForms = useReadingStore((state) => state.discussionForms);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const Reveal = (await import("reveal.js")).default;
        const Markdown = (
          await import("reveal.js/plugin/markdown/markdown.esm.js")
        ).default;

        const deck = new Reveal(revealRef.current, {
          plugins: [Markdown],
        });
        deck.initialize();
      })();
    }
  }, []);

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
        {included?.["includePreReadingVocabulary"] ? (
          <PreReadingVocabularySection vocabulary={vocabulary} />
        ) : null}

        {included?.["includeReadingForGistSection"] ? (
          <GistReadingInstructions
            gistReadingQuestions={inputTexts?.["question"]}
            gistReadingPage={inputTexts?.["page"]}
            sliders={sliders}
            textBoxInputs={textBoxInputs}
            inputTexts={inputTexts}
            time={inputTexts?.["gistReadingTime"]}
            includeGistReadingTimeLimit={
              included?.["includeGistReadingTimeLimit"]
            }
          />
        ) : null}

        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul>Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>

        {included?.["includeGistReadingQuestionPartnerCheck"] ? (
          <PartnerDiscussionSection
            slider={inputTexts?.["gistDiscussionTime"]}
            discussion={discussionForms?.["gistQuestionDiscussion"]}
          />
        ) : null}

        {included?.["includeReadingForDetailSection"] ? (
          <DetailReadingInstructions
            textbookExercises={inputTexts?.["exercise"]}
            slider={inputTexts?.["detailReadingDiscussionTimeLimit"]}
          />
        ) : null}

        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul>Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>

        <PartnerDiscussionSection
          slider={inputTexts?.["detailReadingDiscussionTimeLimit"]}
          time={"detailDiscussionTime"}
          discussion={discussionForms?.["detailAnswersDiscussion"]}
        />

        <section>
          <h1>Book Answers</h1>
        </section>

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
