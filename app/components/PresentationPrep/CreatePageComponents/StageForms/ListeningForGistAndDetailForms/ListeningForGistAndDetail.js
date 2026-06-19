import React, { useEffect, useContext, use } from "react";

import ListeningUploadandTranscribeAudio from "./ListeningUploadandTranscribeAudio";
import ListeningQuestionUploader from "./ListeningQuestionUploader";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import CreeateAudioSnippets from "./CreateAudioSnippets";
import { useLessonStore } from "@app/stores/useLessonStore";
import { getCompleteListeningStageDataFromDB } from "@app/utils/GetStageData";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
  const userID = useLessonStore((state) => state.currentUserID);
  const lessonID = useLessonStore((state) => state.currentLessonID);
  //update audio questions
  const setHydratedAudioQuestions = useAudioTextStore(
    (state) => state.setHydratedAudioQuestions,
  );
  const setHydratedAudioAnswers = useAudioTextStore(
    (state) => state.setHydratedAudioAnswers,
  );

  const setHydratedOcrTranscript = useAudioTextStore(
    (state) => state.setHydratedOcrTranscript,
  );

  const setHydratedComprehensionItems = useAudioTextStore(
    (state) => state.setHydratedComprehensionItems,
  );

  const updateCompleteListeningStageData = useLessonStore(
    (state) => state.updateCompleteListeningStageData,
  );
  const setHydratedSelectedAudioFileName = useAudioTextStore(
    (state) => state.setHydratedSelectedAudioFileName,
  );

  const setHydratedS2tTranscript = useAudioTextStore(
    (state) => state.setHydratedS2tTranscript,
  );
  const setHydratedWordTimeArray = useAudioTextStore(
    (state) => state.setHydratedWordTimeArray,
  );

  const sections = [
    <ListeningQuestionUploader stageID={listeningForGistandDetailStage} />,
    <ListeningUploadandTranscribeAudio />,
    <CreeateAudioSnippets />,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");

    console.log(sectionsLength);

    getSectionsLength(sectionsLength);
  }, []);

  useEffect(() => {
    const fetchListeningData = async () => {
      const allListeningData = await getCompleteListeningStageDataFromDB(
        userID,
        lessonID,
      );
      // You can now use allListeningData here
      setHydratedS2tTranscript(allListeningData?.s2tTranscript || "");
      setHydratedWordTimeArray(allListeningData?.wordTimeArray || []);
      setHydratedAudioQuestions(allListeningData?.audioQuestions || []);
      setHydratedAudioAnswers(allListeningData?.audioAnswers || []);

      //updateAudioTranscript(allListeningData?.audioTranscript || "");
      setHydratedOcrTranscript(allListeningData?.audioTranscript || "");
      setHydratedComprehensionItems(
        allListeningData?.comprehensionItems ||
          allListeningData?.completeListeningStageData?.questionsAndAnswers ||
          [],
      );

      updateCompleteListeningStageData(
        allListeningData?.completeListeningStageData || {},
      );
      setHydratedSelectedAudioFileName(allListeningData?.audioFileName || "");
      useLessonStore.getState().setHasHydratedCompleteListeningStageData(true);
    };
    fetchListeningData();
  }, [userID, lessonID]);

  return <div>{sections[section]}</div>;
};

export default ListeningForGistAndDetail;
