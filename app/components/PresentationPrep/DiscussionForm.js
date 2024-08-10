import { Grid } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import CheckBoxAndLabel from "./AddTextButtons/CheckBoxAndLabel";
import InputWithIcon from "./AddTextButtons/InputWithIcon";
import AddIcon from "@mui/icons-material/Add";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { PhotoSizeSelectLargeTwoTone } from "@mui/icons-material";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const DiscussionForm = ({ id, includedId }) => {
  const { discussionForms, addDiscussionLine } = useContext(
    ReadingForGistAndDetailContext
  );
  console.log("COMPONENT discussionForms: " + JSON.stringify(discussionForms));
  console.log(typeof discussionForms);
  const discussionForm = discussionForms[id] || {
    numberOfDiscussionLines: 2,
    discussionTexts: Array(2).fill(""),
  };

  useEffect(() => {
    if (!discussionForms[id]) {
      addDiscussionLine(id); // Initialize with the first line
      addDiscussionLine(id); // Initialize with the second line
    }
    console.log("discussionForms: " + JSON.stringify(discussionForms));
  }, [id, discussionForms, addDiscussionLine]);

  return (
    <Grid item xs={12} sm={12} paddingBottom={4}>
      <Grid container direction={"row"} spacing={0} padding={0}>
        <Grid item xs={12} sm={12}>
          <CheckBoxAndLabel
            label={"Partner Check Discussion"}
            size={"small"}
            includedId={includedId}
          />
        </Grid>
        <Grid item xs={12} sm={12} className="flex justify-center items-center">
          <div className="border border-gray-300 rounded-lg m-4 relative p-4 w-4/5">
            <Grid container direction={"row"}>
              {discussionForm.discussionTexts &&
                discussionForm.discussionTexts.map((text, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    key={index}
                    paddingLeft={index % 2 === 0 ? 0 : 5}
                    paddingRight={index % 2 !== 0 ? 0 : 3}
                  >
                    <InputWithIcon
                      iconFirst={index % 2 === 0}
                      discussionLine={text || "test"}
                      text={text}
                      index={index}
                      input={"discussion"}
                      id={id}
                    />
                  </Grid>
                ))}
            </Grid>
            <div style={{ width: "100%" }}>
              <button
                onClick={() => addDiscussionLine(id)}
                className="add-discussion-line-button"
              >
                <AddIcon />
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DiscussionForm;
