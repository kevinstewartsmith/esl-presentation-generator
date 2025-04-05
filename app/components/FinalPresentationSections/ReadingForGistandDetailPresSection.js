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

const ReadingForGistandDetailPresSection = () => {
  import("@styles/reveal-hedonic.css");
  const revealRef = useRef(null);
  const { included, vocabulary, inputTexts, discussionForms } = useContext(
    ReadingForGistAndDetailContext
  );
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
  const { hidePresentation } = useContext(GlobalVariablesContext);
  return (
    <>
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
          includeGistReadingTimeLimit={included["includeGistReadingTimeLimit"]}
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
    </>
  );
};

export default ReadingForGistandDetailPresSection;
