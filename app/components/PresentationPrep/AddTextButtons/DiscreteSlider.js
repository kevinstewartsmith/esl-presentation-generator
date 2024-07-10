import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider({min, max, defaultValue, onChange}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        aria-label="Temperature"
        defaultValue={defaultValue}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        shiftStep={30}
        step={1}
        marks
        min={min}
        max={max}
        
        onChangeCommitted={onChange}
      />
      {/* <Slider defaultValue={defaultValue} step={1} marks min={min} max={max} disabled /> */}
    </Box>
  );
}