import React from "react";
import { Grid } from "@mui/material";
//import AudioTable from "@app/components/AudioTable";
import { Button } from "@mui/material";

import GetAudioTranscript from "@app/components/GetAudioTranscript";
import AudioUploadCard from "@app/components/PresentationPrep/AudioUploadCard";
import AudioUploader from "@app/components/PresentationPrep/AudioUploader";
const ListeningUploadandTranscribeAudio = () => {
  return (
    <>
      {/* <h1>ListeningUploadandTranscribeAudio Component </h1> */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ border: "1px solid orange" }}
        //make vertical
        direction="row"
      >
        {/* <Grid item>ListeningUploadandTranscribeAudio Component</Grid> */}
        {/* <Grid item xs={6}>
          {" "}
          <AudioTable />{" "}
        </Grid> */}
        <Grid item xs={6}>
          <GetAudioTranscript />
        </Grid>
        <Grid item xs={6}>
          <AudioUploader />
        </Grid>
      </Grid>
    </>
  );
};

export default ListeningUploadandTranscribeAudio;
