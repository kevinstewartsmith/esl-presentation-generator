import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TitleIcon from "@mui/icons-material/Title";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";

export default function InputWithIcon({
  label,
  input,
  iconFirst,
  id,
  index,
  stageID,
  category,
  text,
}) {
  const {
    updateInputTextsReading,
    inputTexts,
    lessonID,
    updateDiscussionText,
    discussionForms,
  } = useContext(ReadingForGistAndDetailContext);

  console.log("INPUT ICON LESSON ID: " + lessonID);
  console.log("INPUT ICON ID: " + id);
  console.log("INPUT ICON INDEX: " + index);
  console.log("INPUT ICON STAGE ID: " + stageID);
  console.log("INPUT ICON CATEGORY: " + category);
  console.log("INPUT ICON TEXT: " + text);
  const { loggedInUser } = useContext(GlobalVariablesContext);

  function setInput() {
    switch (input) {
      case "question":
        return <HelpOutlineIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      case "answer":
        return <FeedbackIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      case "page" || "exercisePage":
        return <PlagiarismIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      case "exercise":
        return <FitnessCenterIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      case "exercisePage":
        return <AutoStoriesIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      case "lessonTitle":
        return <TitleIcon sx={{ color: "gray", mr: 1, my: 0.5 }} />;
      default:
        return (
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        );
    }
  }

  const handleChange = (event) => {
    switch (input) {
      case "question":
        updateInputTextsReading("question", event.target.value);
        break;
      case "answer":
        updateInputTextsReading("answer", event.target.value);
        break;
      case "page":
        updateInputTextsReading("page", event.target.value);
        break;
      case "exercise":
        updateInputTextsReading("exercise", event.target.value);
        break;
      case "discussion":
        updateDiscussionText(id, index, event.target.value);
        console.log(discussionForms);
        break;
      case "exercisePage":
        updateInputTextsReading("exercisePage", event.target.value);
      default:
        break;
    }
  };

  const getValue = () => {
    switch (input) {
      case "discussion":
        console.log("Discussion input in switch");
        console.log("######################");
        console.log(
          "GET VALUE: " + discussionForms[id]?.discussionTexts[index]
        );
        return discussionForms[id]?.discussionTexts[index] || "";
      //return JSON.stringify(discussionForms);
      default:
        return inputTexts[input] || "";
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <h1>{lessonID}</h1>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: "transparent",
        }}
      >
        {iconFirst ? setInput() : null}
        <TextField
          id="input-with-sx"
          label={label}
          variant="standard"
          style={{ width: "90%", color: "black" }}
          value={getValue()}
          onChange={handleChange}
        />
        {!iconFirst ? setInput() : null}
      </Box>
    </Box>
  );
}
