import React, { useState, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid } from "@mui/material";

const PreviewVocabSlides = ({
  vocabulary,
  selectedVocabNum,
  selectedVocabulary,
  getVocabularyPressed,
  selectedSlide,
  setSelectedSlide,
}) => {
  //const [selectedSlide, setSelectedSlide] = useState(0);

  const backButtonClicked = () => {
    selectedSlide > 0 ? setSelectedSlide(selectedSlide - 1) : null;
  };

  const forwardButtonClicked = () => {
    selectedSlide < selectedVocabNum - 1
      ? setSelectedSlide(selectedSlide + 1)
      : null;
  };

  useEffect(() => {
    selectedSlide > selectedVocabNum - 1
      ? setSelectedSlide(selectedVocabNum - 1)
      : null;
  }, [vocabulary]);

  return (
    <Grid
      container
      direction="column"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid
        item
        xs={8}
        sm={8}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="some-class"
          style={{
            //   width: "100%",
            //   height: "100%",
            height: "90%",
            width: "90%",
            borderColor: "orange",
            borderWidth: 6,
            borderStyle: "solid",
            position: "relative",
          }}
        >
          {selectedVocabulary[selectedSlide] ? (
            <img
              src={selectedVocabulary[selectedSlide].img_url}
              style={{
                height: "70%",
                width: "auto",
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -30%)",
              }}
              alt={selectedVocabulary[selectedSlide].word}
            />
          ) : null}

          {selectedVocabulary[selectedSlide] ? (
            <h1
              style={{
                color: "black",
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "2rem",
              }}
            >
              {selectedVocabulary[selectedSlide].word}
            </h1>
          ) : null}
        </div>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={1} sm={1}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Grid
              item
              xs={3}
              sm={3}
              className="flex items-center justify-center"
            >
              <button onClick={backButtonClicked}>
                <ArrowBackIosNewIcon style={{ fontSize: 36, color: "white" }} />
              </button>
            </Grid>
            <Grid
              item
              xs={3}
              sm={3}
              className="flex items-center justify-center"
            >
              <button onClick={getVocabularyPressed}>Get Vocabulary</button>
            </Grid>
            <Grid
              item
              xs={3}
              sm={3}
              className="flex items-center justify-center"
            >
              <button onClick={forwardButtonClicked}>
                <ArrowForwardIosIcon style={{ fontSize: 36, color: "white" }} />
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1} sm={1} style={{ marginTop: 0 }}>
        <h1 style={{ color: "blue", borderWidth: 1, borderColor: "yellow" }}>
          {"Number of slides: " + selectedVocabNum}
        </h1>
      </Grid>
    </Grid>
  );
};

export default PreviewVocabSlides;
