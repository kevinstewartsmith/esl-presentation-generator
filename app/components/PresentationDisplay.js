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

const PresentationDisplay = ({ presData }) => {
  const revealRef = useRef(null);
  console.log(presData);
  const { vocabulary, included } = useContext(PresentationContext);
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
        <section>
          <h1>Pre-reading</h1>
          <ul>
            {/* <li>{vocabulary[0].word}</li> */}
            <li>cat</li>
            <li>beacon</li>
          </ul>
          {/* <section data-markdown>something</section> */}
        </section>
        {/* <section data-background-color="red">
          <h1>
            Reading for <em>Gist</em>
          </h1>
          <ul>
            <li>
              Read{" "}
              {presData.gistReading.book + " p." + presData.gistReading.page}
              <em> quickly</em>
            </li>
            <li>
              <em>Answer:</em> What is the name of Hercules' cat?
            </li>
            <li>No talking</li>
            <li>Hand up when finished</li>
            <li>
              <em>{presData.gistReading.timeLimit} minutes</em>
            </li>
          </ul>
        </section> */}
        {/* <section>
          <h1>Partner Check</h1>
          <ul>
            <li>{presData.detailPartnerCheck.question}</li>
            <li>{presData.detailPartnerCheck.answer}</li>
          </ul>
        </section> */}
        <section data-background-color="red">
          <h1>
            Reading for <em>Detail</em>
          </h1>
          <ul>
            <li>
              Read Student Book p.23 <em>slowly</em>
            </li>
            <li>
              <em>Complete: </em>
              {/* {presData.detailReading.book +
                " " +
                presData.detailReading.page +
                " exercise " +
                presData.detailReading.exercises}{" "} */}
            </li>
            <li>No talking</li>
            <li>Raise your hand when you are finished</li>
            <li>
              <em>6 minutes</em>
            </li>
          </ul>
        </section>
        <section>
          <h1>Partner Check</h1>
          <ul>
            {/* <li>{presData.detailPartnerCheck.question}</li>
            <li>{presData.detailPartnerCheck.answer}</li> */}
          </ul>
        </section>
        <section>
          <h1>Book Answers</h1>
        </section>
      </div>
    </div>
  );
};

export default PresentationDisplay;
