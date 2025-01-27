import React from "react";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import { Grid } from "@mui/material";

const ListeningQuestionUploader = ({ stageID }) => {
  const sections = ["ListeningQuestionText"];
  const makeGridItem = (component, key) => {
    return (
      <Grid item xs={4} sm={4} key={key} padding={1}>
        <div>{component}</div>
      </Grid>
    );
  };

  return (
    <div className="flex items-center content-center ml-20 mr-20 mt-0">
      <Grid container spacing={0} padding={2} direction={"row"}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {makeGridItem(
              <AddTextBook category={section} stageID={stageID} />,
              index
            )}
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default ListeningQuestionUploader;
