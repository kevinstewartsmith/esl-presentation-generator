import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
//import { useContext } from 'react';
import { PresentationContext } from "@app/contexts/PresentationContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

export default function FreeSoloDropDown({ label, input, stageID }) {
  const { textBoxInputs, updateTextBoxInputs } =
    useContext(PresentationContext);

  const { updateInputTextsReading, inputTexts } = useContext(
    ReadingForGistAndDetailContext
  );

  const handleChange = (event, newVal) => {
    //updateTextBoxInputs(input, newVal);
    console.log("textBoxInputs: " + JSON.stringify(textBoxInputs));
    updateInputTextsReading(input, newVal);
    console.log("UPDATING INPUT :" + input + " WITH VALUE: " + newVal);
  };

  return (
    <Stack
      spacing={0}
      className="w-full h-full"
      sx={{ backgroundColor: "white", left: 0 }}
    >
      {/* <h1>{inputTexts[input]}</h1>
      <h1>{"INPUT" + input}</h1> */}
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={textBookTitles.map((option) => option.title)}
        value={inputTexts[input] || ""}
        onChange={handleChange}
        onInputChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            //onChange={handleChange}
            //value={inputTexts[input]}
            //value={"test"}
          />
        )}
      />
    </Stack>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
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
