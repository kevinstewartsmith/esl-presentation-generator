import React, { useContext } from "react";
import { Grid } from "@mui/material";
import InputWithIcon from "@app/components/PresentationPrep/AddTextButtons/InputWithIcon";
import FreeSoloDropDown from "@app/components/PresentationPrep/AddTextButtons/FreeSoloDropDown";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const TextBookInfoEntry = ({ category, stageID }) => {
  const inputs = (category) => {
    switch (category) {
      case "BookText":
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
              <FreeSoloDropDown
                label={"Text Title"}
                input={"title"}
                stageID={stageID}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              //className="flex items-center justify-center"
            >
              <Grid
                container
                spacing={0}
                padding={0}
                direction={"row"}
                margin={0}
              >
                <Grid
                  item
                  xs={7}
                  sm={7}
                  //className="flex items-center justify-center"
                >
                  <FreeSoloDropDown
                    label={"Book Name"}
                    input={"book"}
                    stageID={stageID}
                  />
                </Grid>

                <Grid item xs={5} sm={5} paddingLeft={2}>
                  <InputWithIcon
                    label={"Page"}
                    input={"page"}
                    stageID={stageID}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      case "QuestionText":
        return (
          <Grid container spacing={0} padding={1} direction={"row"} margin={0}>
            <Grid item xs={12} marginBottom={0}>
              <InputWithIcon
                label={"Textbook Exercises"}
                input={"exercise"}
                iconFirst={"true"}
                stageID={stageID}
              />
            </Grid>
            <Grid item xs={12}>
              <InputWithIcon
                label={"Exercise Page"}
                input={"exercisePage"}
                iconFirst={true}
                stageID={stageID}
              />
            </Grid>
          </Grid>
        );
      case "AnswerText":
        return null;
      default:
        return null;
    }
  };

  return <>{inputs(category)}</>;
};

export default TextBookInfoEntry;
