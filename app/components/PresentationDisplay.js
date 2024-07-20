// components/PresentationDisplay.js
"use client";
import { useEffect, useRef, useContext } from "react";
import dynamic from "next/dynamic";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
//maybe delete this. Ai put it there
//import "reveal.js/plugin/markdown/markdown.css";
import PreReadingVocabularySection from "./FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import { PresentationContext } from "@app/contexts/PresentationContext";
import GistReadingInstructions from "./FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "./FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "./FinalizedPresentation/PartnerDiscussionSection";

const PresentationDisplay = ({ presData }) => {
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
        borderWidth: 10,
        borderColor: 5,
      }}
    >
      {/* <h1>test</h1> */}
      <div className="slides">
        <section data-background-color="red">Slide 1</section>

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
        <PartnerDiscussionSection slider={sliders["gistDiscussionTime"]} />

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
        />
        <section>
          <h1>Book Answers</h1>
        </section>
      </div>
    </div>
  );
};

export default PresentationDisplay;
