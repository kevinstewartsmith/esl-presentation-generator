import React, { useEffect } from "react";

const EffortAndAttitudeScore = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Effort and Attitude form 1</h1>,
    <h1>Effort and Attitude form 2</h1>,
    <h1>Effort and Attitude form 3</h1>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");
    console.log(sectionsLength);
    getSectionsLength(sectionsLength);
  }, []);

  return <div>{sections[section]}</div>;
};

export default EffortAndAttitudeScore;
