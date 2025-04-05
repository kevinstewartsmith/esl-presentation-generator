// components/PresentationDisplay.js
"use client";
import { useEffect, useRef, useContext } from "react";

import PreReadingVocabularySection from "@app/components/FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import GistReadingInstructions from "@app/components/FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "@app/components/FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "@app/components/FinalizedPresentation/PartnerDiscussionSection";
//import ThinkPairShairPresSection from "./FinalPresentationSections/ThinkPairSharePresSection";
//import "reveal.js/dist/theme/moon.css";
import CancelIcon from "@mui/icons-material/Cancel";
import PresSectionComponentMap from "@app/utils/PresSectionComponentMap";

const PresentationDisplay = ({ presData, includedStages }) => {
  //import("reveal.js/dist/theme/moon.css");
  import("@styles/reveal-hedonic.css");

  const revealRef = useRef(null);
  console.log(presData);
  console.log("Presentation Display - Included Stages: ", includedStages);

  const {
    //vocabulary,
    //included,
    gistReadingQuestions,
    gistReadingPage,
    sliders,
    textbookExercises,
    textBoxInputs,
    //includedStages,
    //discussionForms,
  } = useContext(PresentationContext);
  const { included, vocabulary, inputTexts, discussionForms } = useContext(
    ReadingForGistAndDetailContext
  );
  const { hidePresentation } = useContext(GlobalVariablesContext);
  console.log("VOCAB LENGTH: " + JSON.stringify(vocabulary));
  console.log("INCLUDED: " + JSON.stringify(included));

  useEffect(() => {
    // Ensure this runs only on the client-side
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
  //Render a component based on the current stage form index
  function renderComponent(componentName) {
    const ComponentToRender = PresSectionComponentMap[componentName]
      ? PresSectionComponentMap[componentName]
      : null;

    //const ComponentToRender = ReadingForGistandDetailForm;

    if (!ComponentToRender) {
      return <div>Component not found</div>;
    }
    return (
      <ComponentToRender
      // section={sectionNumber}
      // getSectionsLength={getSectionsLength}
      />
    );
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
      {/* <h1>test</h1> */}
      <div className="slides">
        {/* <section data-background-color="blue" data-font-family="Arial">
          <h1>Slide1</h1>Slide 1
        </section> */}

        {included["includePreReadingVocabulary"] ? (
          <PreReadingVocabularySection vocabulary={vocabulary} />
        ) : null}

        {included["includeReadingForGistSection"] ? (
          <GistReadingInstructions
            gistReadingQuestions={inputTexts["question"]}
            gistReadingPage={inputTexts["page"]}
            sliders={sliders}
            textBoxInputs={textBoxInputs}
            inputTexts={inputTexts}
            //FIX
            time={inputTexts["gistReadingTime"]}
            includeGistReadingTimeLimit={
              included["includeGistReadingTimeLimit"]
            }
          />
        ) : null}
        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul> Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>
        {included["includeGistReadingQuestionPartnerCheck"] ? (
          <PartnerDiscussionSection
            slider={inputTexts["gistDiscussionTime"]}
            discussion={discussionForms["gistQuestionDiscussion"]}
          />
        ) : null}
        {included["includeReadingForDetailSection"] ? (
          <DetailReadingInstructions
            //slider={inputTexts["detailReadingTime"]}
            textbookExercises={inputTexts["exercise"]}
            slider={inputTexts["detailReadingDiscussionTimeLimit"]}
          />
        ) : null}
        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul> Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>

        <PartnerDiscussionSection
          slider={inputTexts["detailReadingDiscussionTimeLimit"]}
          time={"detailDiscussionTime"}
          discussion={discussionForms["detailAnswersDiscussion"]}
        />
        <section>
          <h1>Book Answers</h1>
        </section>
        {/* <ThinkPairShairPresSection /> */}
        {includedStages.map((stage, index) => {
          if (stage !== "Start Presentation") {
            const ComponentToRender = renderComponent(stage, index);
            return ComponentToRender;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default PresentationDisplay;
