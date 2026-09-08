import React from "react";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { Grid } from "@mui/material";

const ListeningQuestionUploader = ({ stageID }) => {
  const sections = [
    "ListeningQuestionText",
    "ListeningAnswersText",
    "ListeningTranscript",
  ];
  const makeGridItem = (component, key) => {
    return (
      <Grid item xs={4} sm={4} key={key} padding={1}>
        <div>{component}</div>
      </Grid>
    );
  };

  return (
    <div className="flex flex-col items-center content-center ml-20 mr-20 mt-0">
      {/* Row 1: textbook data entry (book / page / exercise), a third of the width.
          Uses the QuestionText category fragment so it renders the exercise inputs;
          the multipurpose inputs route to the listening store via stageID. */}
      <Grid container spacing={0} padding={2} direction={"row"}>
        <Grid item xs={4} sm={4} padding={1}>
          <TextBookInfoEntry category={"BookText"} stageID={stageID} />
          <TextBookInfoEntry category={"QuestionText"} stageID={stageID} />
        </Grid>
      </Grid>

      {/* Row 2: the media uploaders (questions / answers / transcript) */}
      <Grid container spacing={0} padding={2} direction={"row"}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {makeGridItem(
              <AddTextBook category={section} stageID={stageID} />,
              index,
            )}
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default ListeningQuestionUploader;
