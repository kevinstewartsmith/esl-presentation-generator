import React, { useEffect, useContext } from "react";
import ListeningUploadQuestions from "./ListeningUploadQuestions";
import ListeningUploadandTranscribeAudio from "./ListeningUploadandTranscribeAudio";
import ListeningQuestionUploader from "./ListeningQuestionUploader";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import CreeateAudioSnippets from "./CreeateAudioSnippets";

const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
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

  return <div>{sections[section]}</div>;
};

export default ListeningForGistAndDetail;
