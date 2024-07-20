import React, { useState, useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "./CheckBoxAndLabel";
import DiscreteSlider from "./DiscreteSlider";
import { PresentationContext } from "@app/contexts/PresentationContext";

const TimeLimitSlider = ({ label, defaultValue, max, min, id, includedId }) => {
  console.log("TimeLimitSlider at render: " + id);
  const [sliderValue, setSliderValue] = useState(
    defaultValue ? defaultValue : 3
  );
  const { updateSliderStateMemory, addSliderStateMemory, sliders } =
    useContext(PresentationContext);

  if (!sliders[id]) {
    addSliderStateMemory(id, min, max, defaultValue, label);
    //console.log("sliders: " + JSON.stringify(sliders ? sliders : "no sliders");
  }
  console.log("sliders: " + JSON.stringify(sliders));
  console.log(sliders);

  useEffect(() => {
    if (sliders[id] && sliders[id].value) {
      setSliderValue(sliders[id].value);
    } else {
      setSliderValue(defaultValue);
    }
  }, [sliders]);

  const handleSliderChange = (event, newValue) => {
    console.log("id Slider: " + id);

    console.log("handleSliderChange: " + id);
    updateSliderStateMemory(id, newValue);
    setSliderValue(newValue);
    console.log("sliderValue: " + sliderValue);
    console.log("label: " + label);
  };

  const minuteValue = () => {
    if (sliders[id] && sliders[id].value) {
      return sliders[id].value || defaultValue;
    } else {
      return defaultValue;
    }
  };

  return (
    <Grid
      container
      direction={"column"}
      spacing={0}
      padding={0}
      style={{ backgroundColor: "white", paddingLeft: 0 }}
      includedId={includedId}
    >
      <Grid item xs={12} sm={12}>
        <CheckBoxAndLabel
          label={`${label} - ${sliderValue} minutes`}
          size={"small"}
          includedId={includedId}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        style={{ marginLeft: "10%", marginRight: "10%" }}
      >
        <DiscreteSlider
          min={0}
          max={10}
          defaultValue={defaultValue ? defaultValue : 3}
          onChange={handleSliderChange}
          minuteValue={minuteValue()}
        />
      </Grid>
    </Grid>
  );
};

export default TimeLimitSlider;
