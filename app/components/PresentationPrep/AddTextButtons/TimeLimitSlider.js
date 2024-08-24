import React, { useState, useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "./CheckBoxAndLabel";
import DiscreteSlider from "./DiscreteSlider";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const TimeLimitSlider = ({
  label,
  defaultValue,
  max,
  min,
  id,
  includedId,
  stageID,
}) => {
  console.log("TimeLimitSlider at render: " + id);
  const [sliderValue, setSliderValue] = useState(
    defaultValue ? defaultValue : 3
  );
  // const { updateSliderStateMemory, addSliderStateMemory, sliders } =
  //   useContext(PresentationContext);

  const { updateInputTextsReading, inputTexts } = useContext(
    ReadingForGistAndDetailContext
  );

  // if (!sliders[id]) {
  //   addSliderStateMemory(id, min, max, defaultValue, label);
  // }
  // console.log("sliders: " + JSON.stringify(sliders));

  // useEffect(() => {
  //   if (sliders[id] && sliders[id].value) {
  //     setSliderValue(sliders[id].value);
  //   } else {
  //     setSliderValue(defaultValue);
  //   }
  // }, [sliders]);

  const handleSliderChange = (event, newValue) => {
    console.log("handleSliderChange: " + id);
    //updateSliderStateMemory(id, newValue);
    setSliderValue(newValue);
    console.log("sliderValue: " + sliderValue);
    console.log("label: " + label);
    updateInputTextsReading(id, newValue);
  };

  // const minuteValue = () => {
  //   if (sliders[id] && sliders[id].value) {
  //     return sliders[id].value || defaultValue;
  //   } else {
  //     return defaultValue;
  //   }
  // };
  const minuteValue = () => {
    if (inputTexts[id]) {
      return inputTexts[id];
    } else {
      return defaultValue;
    }
  };

  return (
    <Grid
      container
      direction={"column"}
      style={{ backgroundColor: "white", paddingLeft: 0 }}
      includedId={includedId}
    >
      <Grid item xs={12} sm={12}>
        <CheckBoxAndLabel
          label={`${label} - ${inputTexts[id]} minutes`}
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
          //minuteValue={minuteValue()}
          minuteValue={inputTexts[id] ? inputTexts[id] : defaultValue}
        />
      </Grid>
    </Grid>
  );
};

export default TimeLimitSlider;
