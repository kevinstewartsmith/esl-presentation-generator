import React from "react";
import { Grid } from "@mui/material";
import InputWithIcon from "@app/create/components/PresentationPrep/AddTextButtons/InputWithIcon";
import FreeSoloDropDown from "@app/create/components/PresentationPrep/AddTextButtons/FreeSoloDropDown";

const TextBookInfoEntry = ({ category }) => {
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
              <FreeSoloDropDown label={"Text Title"} input={"title"} />
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
                  xs={8}
                  sm={8}
                  //className="flex items-center justify-center"
                >
                  <FreeSoloDropDown label={"Book Name"} input={"book"} />
                </Grid>

                <Grid item xs={4} sm={4} paddingLeft={2}>
                  <InputWithIcon label={"Page"} input={"page"} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      case "QuestionText":
        return (
          <Grid container spacing={0} padding={1} direction={"row"} margin={0}>
            <Grid item xs={6} sm={6} marginBottom={0}>
              <InputWithIcon
                label={"Textbook Exercises"}
                input={"exercise"}
                iconFirst={"true"}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <InputWithIcon
                label={"Exercise Page"}
                input={"exercisePage"}
                iconFirst={true}
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
