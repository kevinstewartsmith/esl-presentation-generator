import React, { useState, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid } from "@mui/material";

const PreviewVocabSlides = ({
  vocabulary,
  selectedVocabNum,
  selectedVocabulary,
  getVocabularyPressed,
}) => {
  const [selectedSlide, setSelectedSlide] = useState(0);

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
    <div
      //   style={{
      //     height: "36vh",
      //     width: "60vh",
      //     position: "relative",
      //     borderWidth: "4px",
      //     borderColor: "green",
      //   }}
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="some-class"
        style={{
          //   width: "100%",
          //   height: "100%",
          height: "36vh",
          width: "60vh",
          borderColor: "green",
          borderWidth: 1,
          borderStyle: "solid",
          marginTop: 40,
          position: "relative",
        }}
      >
        {/* { selectedVocabulary && selectedVocabulary[selectedSlide].selected && selectedVocabulary[selectedSlide].img_url && (
                <img src={selectedVocabulary[selectedSlide].img_url} style={{ height:"70%", width: "auto", position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -30%)" }} alt={selectedVocabulary[selectedSlide].word} />
            )} */}
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
        {/* { vocabulary && vocabulary[selectedSlide].selected && (
                <h1 style={{ color: "black", position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "2rem" }}>{vocabulary[selectedSlide].word}</h1>
            )} */}
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
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Grid item xs={3} sm={3} className="flex items-center justify-center">
          <button onClick={backButtonClicked}>
            <ArrowBackIosNewIcon style={{ fontSize: 36, color: "white" }} />
          </button>
        </Grid>
        <Grid item xs={3} sm={6} className="flex items-center justify-center">
          <button onClick={getVocabularyPressed}>Get Vocabulary</button>
        </Grid>
        <Grid item xs={3} sm={3} className="flex items-center justify-center">
          <button onClick={forwardButtonClicked}>
            <ArrowForwardIosIcon style={{ fontSize: 36, color: "white" }} />
          </button>
        </Grid>
      </Grid>
      <h1 style={{ color: "black" }}>{selectedVocabNum}</h1>
    </div>
  );
};

export default PreviewVocabSlides;
