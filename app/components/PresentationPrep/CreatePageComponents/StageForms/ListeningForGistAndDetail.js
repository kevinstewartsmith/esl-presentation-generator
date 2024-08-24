import React, { useEffect, useContext } from "react";
import ListeningUploadQuestions from "./ListeningForGistAndDetailForms/ListeningUploadQuestions";

const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
  const sections = [
    <ListeningUploadQuestions />,
    <h1>Listening form 2</h1>,
    <h1>Listening form 3</h1>,
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
