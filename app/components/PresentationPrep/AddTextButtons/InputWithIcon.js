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

export default function InputWithIcon({
  label,
  input,
  size,
  iconFirst,
  discussionLine,
  id,
  index,
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
  } = useContext(PresentationContext);

  function setInput() {
    switch (input) {
      case "question":
        return <HelpOutlineIcon sx={{ color: "#333", mr: 1, my: 0.5 }} />;
      case "answer":
        return <FeedbackIcon sx={{ color: "#333", mr: 1, my: 0.5 }} />;
      case "page":
        return <PlagiarismIcon sx={{ color: "#333", mr: 1, my: 0.5 }} />;
      case "exercise":
        return <FitnessCenterIcon sx={{ color: "#333", mr: 1, my: 0.5 }} />;
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
        break;
      case "answer":
        updateGistReadingAnswers(event.target.value);
        break;
      case "page":
        updateGistReadingPage(event.target.value);
        break;
      case "exercise":
        updateTextbookExercises(event.target.value);
        break;
      case "discussion":
        updateDiscussionText(id, index, event.target.value);
        console.log(discussionForms);
        break;
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
      default:
        return "";
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
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
