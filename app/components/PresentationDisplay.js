// components/PresentationDisplay.js
"use client";
import { useEffect, useRef, useContext } from "react";
import dynamic from "next/dynamic";
import "reveal.js/dist/reveal.css";
//import "reveal.js/dist/theme/black.css";
//maybe delete this. Ai put it there
//import "reveal.js/plugin/markdown/markdown.css";
import PreReadingVocabularySection from "./FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import { PresentationContext } from "@app/contexts/PresentationContext";
import GistReadingInstructions from "./FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "./FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "./FinalizedPresentation/PartnerDiscussionSection";
//import "reveal.js/dist/theme/moon.css";
import CancelIcon from "@mui/icons-material/Cancel";

const PresentationDisplay = ({ presData }) => {
  //import("reveal.js/dist/theme/moon.css");
  import("@styles/reveal-hedonic.css");

  const revealRef = useRef(null);
  console.log(presData);
  const {
    vocabulary,
    included,
    gistReadingQuestions,
    gistReadingPage,
    sliders,
    textbookExercises,
    textBoxInputs,
    discussionForms,
  } = useContext(PresentationContext);
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

  return (
    <div
      className="reveal"
      ref={revealRef}
      style={{
        width: "100vw",
        height: "100vh",
        // borderWidth: 10,
        // borderColor: 5,
      }}
    >
      <button
        onClick={() => {
          console.log("cancel clicked");
        }}
        className="presentation-cancel-button"
      >
        <CancelIcon
          //fontSize="100%"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </button>
      {/* <h1>test</h1> */}
      <div className="slides">
        {/* <button
          onClick={() => {
            "cancel clicked";
          }}
          style={{
            backgroundColor: "pink",
            height: "50px",
            width: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            borderWidth: "1px",
            //borderColor: "black",
            color: "gray",
            position: "fixed",
            zIndex: 9999,
            right: "-20px",
            top: "10px",
          }}
        > */}
        {/* <CancelIcon
            fontSize="large"
            style={{ width: "100%", height: "100%" }}
          />
        </button> */}

        <section data-background-color="blue" data-font-family="Arial">
          <h1>Slide1</h1>Slide 1
        </section>

        {included["includePreReadingVocabulary"] ? (
          <PreReadingVocabularySection vocabulary={vocabulary} />
        ) : null}

        {/* {included["includeGistReading"] ? <GistReadingInstructions /> : null} */}

        <GistReadingInstructions
          gistReadingQuestions={gistReadingQuestions}
          gistReadingPage={gistReadingPage}
          sliders={sliders}
          textBoxInputs={textBoxInputs}
          time={"gistReadingTime"}
        />
        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul> Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>
        <PartnerDiscussionSection
          slider={sliders["gistDiscussionTime"]}
          discussion={discussionForms["gistQuestionDiscussion"]}
        />

        <DetailReadingInstructions
          sliders={sliders}
          textbookExercises={textbookExercises}
        />
        <section>
          <h1>Stop and Look</h1>
          <ul>Zip It</ul>
          <ul> Eyes on teacher</ul>
          <ul>Listen</ul>
        </section>
        <PartnerDiscussionSection
          slider={sliders["detailReadingDiscussionTimeLimit"]}
          time={"detailDiscussionTime"}
          discussion={discussionForms["detailAnswersDiscussion"]}
        />
        <section>
          <h1>Book Answers</h1>
        </section>
      </div>
    </div>
  );
};

export default PresentationDisplay;
