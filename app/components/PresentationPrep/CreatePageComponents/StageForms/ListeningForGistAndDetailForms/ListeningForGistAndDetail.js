import React, { useEffect, useContext, use } from "react";

import ListeningUploadandTranscribeAudio from "./ListeningUploadandTranscribeAudio";
import ListeningQuestionUploader from "./ListeningQuestionUploader";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import CreeateAudioSnippets from "./CreateAudioSnippets";
import { useLessonStore } from "@app/stores/useLessonStore";
import { getCompleteListeningStageDataFromDB } from "@app/utils/GetStageData";
import { all } from "@node_modules/axios";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
  const userID = useLessonStore((state) => state.currentUserID);
  const lessonID = useLessonStore((state) => state.currentLessonID);
  //update audio questions
  const updateAudioQuestions = useLessonStore(
    (state) => state.updateAudioQuestions,
  );
  const updateAudioAnswers = useLessonStore(
    (state) => state.updateAudioAnswers,
  );
  const updateAudioTranscript = useLessonStore(
    (state) => state.updateAudioTranscript,
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
      updateAudioQuestions(allListeningData?.audioQuestions || "");
      updateAudioAnswers(allListeningData?.audioAnswers || "");
      updateAudioTranscript(allListeningData?.audioTranscript || "");
      updateCompleteListeningStageData(
        allListeningData?.completeListeningStageData || {},
      );
      setHydratedSelectedAudioFileName(allListeningData?.audioFileName || "");
      useLessonStore.getState().setHasHydratedCompleteListeningStageData(true);
      useLessonStore.getState().setHasHydratedAudioQuestions(true);
      useLessonStore.getState().setHasHydratedAudioAnswers(true);
    };
    fetchListeningData();
  }, [userID, lessonID]);

  return <div>{sections[section]}</div>;
};

export default ListeningForGistAndDetail;
