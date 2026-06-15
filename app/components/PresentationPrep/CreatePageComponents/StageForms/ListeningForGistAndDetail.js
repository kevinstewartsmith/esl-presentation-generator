import React, { useEffect, useContext } from "react";
import ListeningUploadQuestions from "./ListeningForGistAndDetailForms/ListeningUploadQuestions";
import ListeningUploadandTranscribeAudio from "./ListeningForGistAndDetailForms/ListeningUploadandTranscribeAudio";
import ListeningQuestionUploader from "./ListeningForGistAndDetailForms/ListeningQuestionUploader";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
  const sections = [
    <ListeningQuestionUploader stageID={listeningForGistandDetailStage} />,
    <ListeningUploadandTranscribeAudio />,
    <div></div>,
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
