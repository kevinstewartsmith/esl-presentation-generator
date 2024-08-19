import React, { useEffect } from "react";

const Brainstorming = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Brainstorming form 1</h1>,
    <h1>Brainstorming form 2</h1>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");
    console.log(sectionsLength);
    getSectionsLength(sectionsLength);
  }, []);

  return <div>{sections[section]}</div>;
};

export default Brainstorming;
