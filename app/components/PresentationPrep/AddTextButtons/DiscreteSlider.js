import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value} minutes`;
}

export default function DiscreteSlider({
  minuteValue,
  min,
  max,
  defaultValue,
  onChange,
  id,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        aria-label="Minutes"
        defaultValue={minuteValue}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        shiftStep={30}
        step={1}
        marks
        min={min}
        max={max}
        //value={4}
        onChangeCommitted={onChange}
      />
    </Box>
  );
}
