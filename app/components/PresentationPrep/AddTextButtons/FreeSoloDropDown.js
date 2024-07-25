import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
//import { useContext } from 'react';
import { PresentationContext } from "@app/contexts/PresentationContext";

export default function FreeSoloDropDown({ label, input }) {
  const { textBoxInputs, updateTextBoxInputs } =
    useContext(PresentationContext);

  const handleChange = (event, newVal) => {
    updateTextBoxInputs(input, newVal);
    console.log("textBoxInputs: " + JSON.stringify(textBoxInputs));
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
        value={textBoxInputs[input] || ""}
        onChange={handleChange}
        onInputChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            //onChange={handleChange}
            value={textBoxInputs[input]}
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
