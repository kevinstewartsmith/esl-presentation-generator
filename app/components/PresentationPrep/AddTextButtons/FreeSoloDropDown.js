import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useReadingStore } from "@app/stores/useReadingStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import {
  listeningForGistandDetailStage,
  readingForGistandDetailStage,
} from "@app/utils/SectionIDs";

export default function FreeSoloDropDown({ label, input, stageID }) {
  // ---- Stage-agnostic inputTexts store selection (same pattern as
  // InputWithIcon / AddTextBook): subscribe to all, pick by stageID. ----
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

  const handleChange = (event, newVal) => {
    updateInputTextForKey(input, newVal);
  };

  return (
    <Stack
      spacing={0}
      className="w-full h-full"
      sx={{ backgroundColor: "white", left: 0 }}
    >
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={textBookTitles.map((option) => option.title)}
        value={inputTexts?.[input] || ""}
        onChange={handleChange}
        onInputChange={handleChange}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Stack>
  );
}

const textBookTitles = [
  { title: "Think Starter Student Book", year: 1994 },
  { title: "Think Starter Workbook", year: 1972 },
  { title: "Think 1 Student Book", year: 1994 },
  { title: "Think 1 Workbook", year: 1972 },
  { title: "Think 2 Student Book", year: 1994 },
  { title: "Think 2 Workbook", year: 1972 },
  { title: "Think 3 Student Book", year: 1974 },
  { title: "Think 3 Workbook", year: 2008 },
];
