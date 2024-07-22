import React from "react";
import AddTextBook from "./AddTextBook";
import { Grid } from "@mui/material";

const ReadingContent = () => {
  const sections = ["BookText", "QuestionText", "AnswerText"];
  const makeGridItem = (component, key) => {
    return (
      <Grid item xs={4} sm={4} key={key} padding={1}>
        <div>
          <h3>Book Text</h3>
          {component}
        </div>
      </Grid>
    );
  };

  return (
    <div
      className="flex items-center content-center 
    //bg-yellow-500 
    m-20"
    >
      <Grid container spacing={0} padding={2} direction={"row"}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {makeGridItem(<AddTextBook category={section} />, index)}
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );

  // return (
  //   <div>
  //     <div style={{ paddingTop: 40 }}>
  //       <AddTextBook category={"BookText"} />
  //       <AddTextBook category={"QuestionText"} />
  //       <AddTextBook category={"AnswerText"} />
  //     </div>
  //   </div>
  // );
};

export default ReadingContent;
