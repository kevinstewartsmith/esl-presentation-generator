import { useReadingStore } from "@app/stores/useReadingStore";
import PreReadingVocabularySection from "@app/components/FinalizedPresentation/PrereadingVocabulary/PreReadingVocabularySection";
import GistReadingInstructions from "@app/components/FinalizedPresentation/GistReadingInstructions";
import DetailReadingInstructions from "@app/components/FinalizedPresentation/DetailReadingInstructions";
import PartnerDiscussionSection from "@app/components/FinalizedPresentation/PartnerDiscussionSection";

const ReadingForGistandDetailPresSection = () => {
  import("@styles/reveal-hedonic.css");

  const included = useReadingStore((state) => state.included);
  const vocabulary = useReadingStore((state) => state.readingVocab);
  const inputTexts = useReadingStore((state) => state.inputTexts);
  const discussionForms = useReadingStore((state) => state.discussionForms);

  return (
    <>
      {included?.["includePreReadingVocabulary"] ? (
        <PreReadingVocabularySection vocabulary={vocabulary} />
      ) : null}

      {included?.["includeReadingForGistSection"] ? (
        <GistReadingInstructions
          gistReadingQuestions={inputTexts?.["question"]}
          gistReadingPage={inputTexts?.["page"]}
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
    </>
  );
};

export default ReadingForGistandDetailPresSection;
