import React from "react";
import { Grid } from "@mui/material";
import InputWithIcon from "./AddTextButtons/InputWithIcon";

const DetailExerciseInputs = ({ stacked }) => {
  return (
    <Grid container spacing={0} padding={1} direction={"row"} margin={0}>
      <Grid item xs={stacked ? 12 : 8} marginBottom={0}>
        <InputWithIcon
          label={"Textbook Exercises"}
          input={"exercise"}
          iconFirst={"true"}
        />
      </Grid>
      <Grid item xs={stacked ? 12 : 4}>
        <InputWithIcon
          label={"Exercise Page"}
          input={"exercisePage"}
          iconFirst={true}
        />
      </Grid>
    </Grid>
  );
};

export default DetailExerciseInputs;
