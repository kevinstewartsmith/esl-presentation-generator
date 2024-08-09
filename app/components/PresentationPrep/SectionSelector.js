import React, { useState } from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "./AddTextButtons/CheckBoxAndLabel";
import { ReadingForGist } from "../SectionSelector/ReadingForGist";
import PreReadingVocabulary from "../SectionSelector/PreReadingVocabulary";
import ReadingForDetail from "../SectionSelector/ReadingForDetail";
import PreReadingGame from "../SectionSelector/PreReadingGame";

const SectionSelector = ({ stageID }) => {
  const sections = [
    <PreReadingVocabulary
      includedId={"includePreReadingVocabulary"}
      stageID={stageID}
    />,
    <PreReadingGame includedId={"includePreReadingGame"} stageID={stageID} />,
    <ReadingForGist
      includedId={"includeReadingForGistSection"}
      stageID={stageID}
    />,
    <ReadingForDetail
      includedId={"includeReadingForDetailSection"}
      stageID={stageID}
    />,
  ];
  return (
    <Grid container className="presentation-grid-container" direction={"row"}>
      {sections.map((section, index) => (
        <React.Fragment key={index}>{section}</React.Fragment>
      ))}
    </Grid>
  );
};

export default SectionSelector;
