import React, { useState } from 'react'
import { Grid } from '@mui/material'
import CheckBoxAndLabel from './CheckBoxAndLabel'
import DiscreteSlider from './DiscreteSlider'


const TimeLimitSlider = ({label}) => {

    const [sliderValue, setSliderValue] = useState(3);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        console.log("sliderValue: " + sliderValue);
      };

  return (
    <Grid container direction={"column"}  spacing={0} padding={0} style={{ backgroundColor: "white", paddingLeft:0 }} > 
        <Grid item xs={12} sm={12}  >
            <CheckBoxAndLabel label={`${label} - ${sliderValue} minutes`} size={"small"} />
        </Grid> 
        <Grid item xs={12} sm={12} style={{ marginLeft: "10%", marginRight: "10%" }} >
            <DiscreteSlider min={0} max={10} defaultValue={3} onChange={handleSliderChange}   />
        </Grid>       
    </Grid>
  )
}

export default TimeLimitSlider