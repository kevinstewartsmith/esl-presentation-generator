import React from "react";
import { Grid } from "@mui/material";

const PartnerDiscussionSection = ({ slider, discussion }) => {
  return (
    <>
      <section>
        <h1>Partner Discussion</h1>
        <Grid container direction={"row"}>
          <Grid item xs={6} sm={6}>
            <ul>
              <li>Discuss with your partner</li>
              <li>Use the phrases</li>
              <li>{"Say long answers"}</li>
              <li>
                Use linking words: <em>and, because, but, so</em>
              </li>

              <li>{slider.value + " minutes"}</li>
            </ul>
          </Grid>

          <Grid item xs={6} sm={6}>
            <Grid container direction={"column"}>
              {discussion
                ? discussion.discussionTexts &&
                  discussion.discussionTexts.map((text, index) =>
                    text !== "" && text !== null ? (
                      <Grid item xs={12} sm={12}>
                        <h5 key={index}>
                          <strong>
                            {index % 2 === 0 ? "Partner A: " : "Partner B: "}
                            <em>{text}</em>
                          </strong>
                        </h5>
                      </Grid>
                    ) : null
                  )
                : null}
            </Grid>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default PartnerDiscussionSection;
