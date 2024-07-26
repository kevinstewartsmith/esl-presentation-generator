import React from "react";
import { Grid } from "@mui/material";
import FreeSoloDropDown from "@app/components/PresentationPrep/AddTextButtons/FreeSoloDropDown";
import InputWithIcon from "@app/components/PresentationPrep/AddTextButtons/InputWithIcon";

const GistExerciseInputs = () => {
  return (
    <Grid
      container
      spacing={0}
      padding={2}
      direction={"column"}
      margin={0}
      //className="flex items-center justify-center"
      //style={{ borderColor: "red", backgroundColor: "blue" }}
    >
      <Grid item xs={12} sm={12} spacing={0} marginBottom={2}>
        <FreeSoloDropDown label={"Text Title"} input={"title"} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        //className="flex items-center justify-center"
      >
        <Grid container spacing={0} padding={0} direction={"row"} margin={0}>
          <Grid
            item
            xs={8}
            sm={8}
            //className="flex items-center justify-center"
          >
            <FreeSoloDropDown label={"Book Name"} input={"book"} />
          </Grid>

          <Grid item xs={4} sm={4} paddingLeft={2}>
            <InputWithIcon label={"Page"} input={"page"} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GistExerciseInputs;
