import React, { useContext, useEffect } from "react";
import ReadingContent from "@app/components/PresentationPrep/ReadingContent";
import SectionSelector from "@app/components/PresentationPrep/SectionSelector";
import PreReadingVocabSlides from "@app/components/PresentationPrep/PreReadingVocabSlides";
import PreReadingGames from "@app/components/PresentationPrep/PreReadingGames";
import FinishReading from "@app/components/SectionSelector/FinishReading";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import { readingForGistandDetailStage } from "@app/utils/SectionIDs";

const ReadingForGistandDetailForm = ({ sectionNumber, getSectionLength }) => {
  const {
    fetchDataFromFirestore,
    getAllInputDataFromFirestore,
    updateLessonID,
    lessonID,
    getAllDiscussionDataFromFirestore,
    fetchTextbookDataFromDB,
    fetchIncludedDataFromFirestore,
  } = useContext(ReadingForGistAndDetailContext);

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
    const sectionsLegnth = sections.length;
    getSectionLength(sectionsLegnth);
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
      {sections[sectionNumber]}
    </div>
  );
};

export default ReadingForGistandDetailForm;
