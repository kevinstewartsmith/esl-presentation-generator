import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TitleIcon from "@mui/icons-material/Title";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";

export default function InputWithIcon({
  label,
  input,
  size,
  iconFirst,
  discussionLine,
  id,
  index,
  stageID,
}) {
  const {
    gistReadingQuestions,
    gistReadingAnswers,
    updateGistReadingQuestions,
    updateGistReadingAnswers,
    gistReadingPage,
    updateGistReadingPage,
    textbookExercises,
    updateTextbookExercises,
    updateDiscussionText,
    discussionForms,
    updateTextbookExercisePages,
    textbookExercisePages,
  } = useContext(PresentationContext);
  const { updateInputTextsReading, inputTexts, lessonID } = useContext(
    ReadingForGistAndDetailContext
  );

  console.log("INPUT ICON LESSON ID: " + lessonID);
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
        updateGistReadingQuestions(event.target.value);
        updateInputTextsReading("question", event.target.value);
        break;
      case "answer":
        updateGistReadingAnswers(event.target.value);
        updateInputTextsReading("answer", event.target.value);
        break;
      case "page":
        updateGistReadingPage(event.target.value);
        updateInputTextsReading("page", event.target.value);
        break;
      case "exercise":
        updateTextbookExercises(event.target.value);
        updateInputTextsReading("exercise", event.target.value);
        break;
      case "discussion":
        updateDiscussionText(id, index, event.target.value);
        console.log(discussionForms);
        break;
      case "exercisePage":
        updateTextbookExercisePages(event.target.value);
        updateInputTextsReading("exercisePage", event.target.value);
      default:
        break;
    }
  };

  const getValue = () => {
    switch (input) {
      case "question":
        return gistReadingQuestions;
      case "answer":
        return gistReadingAnswers;
      case "page":
        return gistReadingPage;
      case "exercise":
        return textbookExercises;
      case "discussion":
        return discussionForms[id]?.discussionTexts[index] || "";
      case "exercisePage":
        return textbookExercisePages;
      default:
        return "";
    }
  };

  // const getValueFromFirestore = (loggedInUser, input) => {
  //   getInputValuesFromFirestore(loggedInUser, input);
  // }

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <h1>{lessonID}</h1>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          //height: "100%",
          //justifyContent: "center",
          //alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        {iconFirst ? setInput() : null}
        <TextField
          id="input-with-sx"
          label={label}
          variant="standard"
          style={{ width: "90%", color: "black" }}
          //value={getValue()}
          value={inputTexts[input] || ""}
          onChange={handleChange}
        />
        {!iconFirst ? setInput() : null}
      </Box>
    </Box>
  );
}
