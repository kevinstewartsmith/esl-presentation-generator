import React, { useEffect } from "react";

const SpeakingDebate = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Speaking Debate form 1</h1>,
    <h1>Speaking Debate form 2</h1>,
    <h1>Speaking Debate form 3</h1>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");
    console.log(sectionsLength);
    getSectionsLength(sectionsLength);
  }, []);

  return <div>{sections[section]}</div>;
};

export default SpeakingDebate;
