import React, { useState } from "react";
import { Grid } from "@mui/material";
import CheckBoxAndLabel from "../PresentationPrep/AddTextButtons/CheckBoxAndLabel";
import FreeSoloDropDown from "../PresentationPrep/AddTextButtons/FreeSoloDropDown";
import InputWithIcon from "../PresentationPrep/AddTextButtons/InputWithIcon";
import TimeLimitSlider from "../PresentationPrep/AddTextButtons/TimeLimitSlider";
import DiscussionForm from "../PresentationPrep/DiscussionForm";
import GistExerciseInputs from "../PresentationPrep/GistExerciseInputs";

export const ReadingForGist = ({ index, includedId, stageID }) => {
  const [gistReadingChecked, setGistReadingChecked] = useState(true);

  const handleCheckBoxChange = () => {
    setGistReadingChecked(!gistReadingChecked);
  };

  return (
    <>
      <Grid
        item
        sm={12}
        lg={12}
        key={index}
        marginBottom={4}
        className="reading-lesson-section"
      >
        <Grid container direction={"row"}>
          <Grid item xs={12} sm={12}>
            <CheckBoxAndLabel
              size={"medium"}
              label={"Reading For Gist"}
              id={"includeReadingForGistSection"}
              checked={gistReadingChecked}
              onChange={handleCheckBoxChange}
              includedId={includedId}
              stageID={stageID}
            />
          </Grid>

          {gistReadingChecked ? (
            <Grid item xs={12} sm={12} className="section-details-container">
              <Grid
                container
                direction={"row"}
                style={{
                  backgroundColor: "white",
                  paddingLeft: 60,
                  paddingBottom: 20,
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  paddingBottom={4}
                  paddingRight={9}
                  paddingLeft={2}
                >
                  <GistExerciseInputs stageID={stageID} />
                </Grid>
                <Grid item xs={12} sm={12} paddingBottom={4}>
                  <TimeLimitSlider
                    label={"Reading Time Limit"}
                    defaultValue={2}
                    id={"gistReadingTime"}
                    min={0}
                    max={10}
                    includedId={"includeGistReadingTimeLimit"}
                    stageID={stageID}
                  />
                </Grid>
                <Grid item xs={12} sm={12} paddingBottom={4}>
                  <InputWithIcon
                    iconFirst={true}
                    label={"Question"}
                    input={"question"}
                    size={"wide"}
                    stageID={stageID}
                  />
                </Grid>
                <Grid item xs={12} sm={12} paddingBottom={4}>
                  <InputWithIcon
                    iconFirst={true}
                    label={"Answer"}
                    input={"answer"}
                    stageID={stageID}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={12} paddingBottom={4}> */}
                <DiscussionForm
                  id={"gistQuestionDiscussion"}
                  includedId={"includeGistReadingQuestionPartnerCheck"}
                  stageID={stageID}
                />
                {/* </Grid> */}
                <Grid item xs={12} sm={12} paddingBottom={4}>
                  <TimeLimitSlider
                    label={"Discussion Time Limit"}
                    defaultValue={2}
                    id={"gistDiscussionTime"}
                    min={0}
                    max={10}
                    includedId={
                      "includeGistReadingQuestionPartnerCheckTimeLimit"
                    }
                    stageID={stageID}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};
