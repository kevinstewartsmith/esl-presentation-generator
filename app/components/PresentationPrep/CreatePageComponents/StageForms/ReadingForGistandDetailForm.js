import React, { useContext, useEffect } from "react";
import ReadingContent from "@app/components/PresentationPrep/ReadingContent";
import SectionSelector from "@app/components/PresentationPrep/SectionSelector";
import PreReadingVocabSlides from "@app/components/PresentationPrep/PreReadingVocabSlides";
import PreReadingGames from "@app/components/PresentationPrep/PreReadingGames";
import FinishReading from "@app/components/SectionSelector/FinishReading";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import { readingForGistandDetailStage } from "@app/utils/SectionIDs";
import { useReadingStore } from "@app/stores/useReadingStore";
import { useLessonStore } from "@app/stores/useLessonStore";
import { getReadingTextDataFromDB } from "@app/utils/GetStageData";

const ReadingForGistandDetailForm = ({ section, getSectionsLength }) => {
  const {
    fetchDataFromFirestore,
    getAllInputDataFromFirestore,
    updateLessonID,
    lessonID,
    getAllDiscussionDataFromFirestore,
    fetchTextbookDataFromDB,
    fetchIncludedDataFromFirestore,
  } = useContext(ReadingForGistAndDetailContext);

  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);

  const resetReadingStore = useReadingStore((state) => state.resetReadingStore);
  const setHydratedTextbook = useReadingStore(
    (state) => state.setHydratedTextbook,
  );
  const setHydratedQuestions = useReadingStore(
    (state) => state.setHydratedQuestions,
  );
  const setHydratedAnswers = useReadingStore(
    (state) => state.setHydratedAnswers,
  );
  const setHydratedInputTexts = useReadingStore(
    (state) => state.setHydratedInputTexts,
  );

  const setHasAttemptedReadingHydration = useReadingStore(
    (state) => state.setHasAttemptedReadingHydration,
  );

  const setHydratedDiscussions = useReadingStore(
    (state) => state.setHydratedDiscussions,
  );

  const setHydratedReadingVocab = useReadingStore(
    (state) => state.setHydratedReadingVocab,
  );

  useEffect(() => {
    const fetchReadingData = async () => {
      resetReadingStore();
      const data = await getReadingTextDataFromDB(
        currentUserID,
        currentLessonID,
      );
      setHydratedTextbook(data?.texts ?? null);
      setHydratedQuestions(data?.questions ?? null);
      setHydratedAnswers(data?.answers ?? null);
      setHydratedInputTexts(data?.inputTexts ?? {});
      setHydratedDiscussions(data?.discussionForms ?? {});
      setHasAttemptedReadingHydration(true);
      setHydratedReadingVocab(data?.readingVocab ?? []);
    };
    if (currentUserID && currentLessonID) fetchReadingData();
  }, [currentUserID, currentLessonID]);

  const sections = [
    <ReadingContent stageID={readingForGistandDetailStage} />,
    <SectionSelector stageID={readingForGistandDetailStage} />,
    <PreReadingVocabSlides
      stageID={readingForGistandDetailStage}
      lessonID={lessonID}
    />,
    <PreReadingGames stageID={readingForGistandDetailStage} />,
    <FinishReading stageID={readingForGistandDetailStage} />,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");

    console.log(sectionsLength);

    getSectionsLength(sectionsLength);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh - 50px",
        display: "flex",
        top: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
      }}
    >
      {sections[section]}
    </div>
  );
};

export default ReadingForGistandDetailForm;
