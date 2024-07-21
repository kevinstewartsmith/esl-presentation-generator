import React from "react";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
// import '../../globals.css';

const PresentationItems = ({ slide, index }) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <Grid
      item
      className="presentation-item"
      xs={12}
      key={index}
      spacing={0}
      marginTop={0}
    >
      <Grid
        container
        direction={"row"}
        spacing={2}
        padding={0}
        style={{ width: "100%", height: "100%" }}
      >
        <Grid item xs={2} sm={2}>
          <Checkbox {...slide} defaultChecked />
          <Checkbox {...slide} defaultChecked color="default" />
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Grid>
        <Grid item xs={10} sm={10}>
          <h1>{slide}</h1>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PresentationItems;
