import React, { useContext, useEffect, useState } from "react";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { Grid } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const CheckBoxAndLabel = ({
  label,
  input,
  size,
  checked,
  onChange,
  includedId,
}) => {
  //const { included, updateIncludedSection } = useContext(PresentationContext);
  const { included, updateIncludedSection } = useContext(
    ReadingForGistAndDetailContext
  );
  function onCheck() {
    updateIncludedSection(includedId);
    //updateInputTextsReading(inputTexts[includedId], !included[includedId]);
  }

  useEffect(() => {
    console.log("INCLUDED");
    console.log(included);
  }, [included]);

  function setInputSize() {
    switch (size) {
      case "small":
        //console.log("small: " + size);
        return 20;
      case "medium":
        return 30;
      case "large":
        return 40;
      default:
        return 30;
    }
  }

  return (
    <div className="pink-background">
      <Grid
        container
        direction={"row"}
        spacing={0}
        padding={0}
        style={{
          backgroundColor: "white",
          paddingLeft: 10,
          paddingTop: 0,
          width: "100%",
        }}
      >
        <Grid
          item
          xs={0.5}
          sm={1}
          className="flex justify-center items-center height-full"
          style={{}}
        >
          <input
            type="checkbox"
            style={{ width: setInputSize(), height: setInputSize() }}
            checked={included[includedId] ? included[includedId] : false}
            onChange={onCheck}
          />
        </Grid>
        <Grid item xs={11.5} sm={11} style={{ fontSize: 24 }}>
          <h1 style={{ color: "gray" }}>{label}</h1>
        </Grid>
      </Grid>
    </div>
  );
};

export default CheckBoxAndLabel;
