import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TitleIcon from "@mui/icons-material/Title";
import { useReadingStore } from "@app/stores/useReadingStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useLessonStore } from "@app/stores/useLessonStore";
import {
  listeningForGistandDetailStage,
  readingForGistandDetailStage,
} from "@app/utils/SectionIDs";

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
  const lessonID = useLessonStore((state) => state.currentLessonID);

  // Discussion writes only exist on the reading store.
  const updateDiscussionText = useReadingStore(
    (state) => state.updateDiscussionText,
  );
  const discussionForms = useReadingStore((state) => state.discussionForms);

  // ---- Stage-agnostic inputTexts store selection ----
  // Both stores expose identically-named inputTexts + updateInputTextForKey.
  // Subscribe to all unconditionally (hook rules), then pick by stageID.
  // Adding a stage = add its two selectors + one registry line.
  const readingUpdateInputTextForKey = useReadingStore(
    (state) => state.updateInputTextForKey,
  );
  const readingInputTexts = useReadingStore((state) => state.inputTexts);

  const audioUpdateInputTextForKey = useAudioTextStore(
    (state) => state.updateInputTextForKey,
  );
  const audioInputTexts = useAudioTextStore((state) => state.inputTexts);

  const INPUT_STORE_BY_STAGE = {
    [readingForGistandDetailStage]: {
      updateInputTextForKey: readingUpdateInputTextForKey,
      inputTexts: readingInputTexts,
    },
    [listeningForGistandDetailStage]: {
      updateInputTextForKey: audioUpdateInputTextForKey,
      inputTexts: audioInputTexts,
    },
  };

  const { updateInputTextForKey, inputTexts } =
    INPUT_STORE_BY_STAGE[stageID] ??
    INPUT_STORE_BY_STAGE[readingForGistandDetailStage];

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
        updateInputTextForKey("question", event.target.value);
        break;
      case "answer":
        updateInputTextForKey("answer", event.target.value);
        break;
      case "page":
        updateInputTextForKey("page", event.target.value);
        break;
      case "exercise":
        updateInputTextForKey("exercise", event.target.value);
        break;
      case "discussion":
        updateDiscussionText(id, index, event.target.value);
        break;
      case "exercisePage":
        updateInputTextForKey("exercisePage", event.target.value);
        break;
      default:
        break;
    }
  };

  const getValue = () => {
    switch (input) {
      case "discussion":
        return discussionForms?.[id]?.discussionTexts?.[index] || "";
      default:
        return inputTexts?.[input] || "";
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
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
