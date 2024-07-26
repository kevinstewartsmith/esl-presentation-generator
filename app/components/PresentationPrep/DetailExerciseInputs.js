import React from "react";
import { Grid } from "@mui/material";
import InputWithIcon from "./AddTextButtons/InputWithIcon";

const DetailExerciseInputs = () => {
  return (
    <Grid container spacing={0} padding={1} direction={"row"} margin={0}>
      <Grid item xs={8} sm={8} marginBottom={0}>
        <InputWithIcon
          label={"Textbook Exercises"}
          input={"exercise"}
          iconFirst={"true"}
        />
      </Grid>
      <Grid item xs={4} sm={4}>
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
