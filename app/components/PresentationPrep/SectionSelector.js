import React, { useState } from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "./AddTextButtons/CheckBoxAndLabel";
import { ReadingForGist } from "../SectionSelector/ReadingForGist";
import PreReadingVocabulary from "../SectionSelector/PreReadingVocabulary";
import ReadingForDetail from "../SectionSelector/ReadingForDetail";
import PreReadingGame from "../SectionSelector/PreReadingGame";

const SectionSelector = () => {
  const sections = [
    <PreReadingVocabulary includedId={"includePreReadingVocabulary"} />,
    <PreReadingGame includedId={"includePreReadingGame"} />,
    <ReadingForGist includedId={"includeReadingForGistSection"} />,
    <ReadingForDetail includedId={"includeReadingForDetailSection"} />,
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
