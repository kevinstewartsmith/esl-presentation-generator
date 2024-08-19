import React, { useEffect } from "react";

const ListeningForGistAndDetail = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Listening form 1</h1>,
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
