import React from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "./AddTextButtons/CheckBoxAndLabel";

const DetailReadingExAnswers = ({ includedId }) => {
  return (
    <Grid item xs={12} sm={12}>
      <Grid
        container
        direction={"column"}
        spacing={0}
        padding={0}
        style={{ backgroundColor: "white", paddingLeft: 0 }}
      >
        <Grid item xs={12} sm={12}>
          <CheckBoxAndLabel
            label={"Answers"}
            size={"small"}
            includedId={includedId}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailReadingExAnswers;
