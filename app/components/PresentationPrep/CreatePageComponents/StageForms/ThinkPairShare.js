import React, { useEffect } from "react";
import Think from "./ThinkPairShairForms/Think";

const ThinkPairShare = ({ getSectionsLength, section }) => {
  const sections = [
    <Think />,
    <div>ThinkPairShare 2</div>,
    <div>ThinkPairShare 3</div>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");

    console.log("Think - Pair - Share Length" + sectionsLength);

    getSectionsLength(sectionsLength);
  }, []);

  //return <div>ThinkPairShare Component</div>;
  return <div>{sections[section]}</div>;
};

export default ThinkPairShare;
