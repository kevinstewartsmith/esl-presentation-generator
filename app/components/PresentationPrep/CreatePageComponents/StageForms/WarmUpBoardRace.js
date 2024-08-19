import React, { useEffect } from "react";

const WarmUpBoardRace = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Warm Up Board Race form 1</h1>,
    <h1>Warm Up Board Race form 2</h1>,
    <h1>Warm Up Board Race form 3</h1>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");
    console.log(sectionsLength);
    getSectionsLength(sectionsLength);
  }, []);

  return <div>{sections[section]}</div>;
};

export default WarmUpBoardRace;
