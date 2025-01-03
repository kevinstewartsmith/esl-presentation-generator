import React, { useEffect } from "react";

const ClassRules = ({ getSectionsLength, section }) => {
  const sections = [
    <h1>Class Rules form 1</h1>,
    <h1>Class Rules form 2</h1>,
    <h1>Class Rules form 3</h1>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");
    console.log(sectionsLength);
    getSectionsLength(sectionsLength);
  }, []);

  return (
    <div>
      {sections[section]}
      <h1>Class Rules form </h1>
    </div>
  );
};

export default ClassRules;
