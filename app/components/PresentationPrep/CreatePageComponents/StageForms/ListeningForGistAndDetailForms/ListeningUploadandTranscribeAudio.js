import React, { useContext } from "react";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import { Grid } from "@mui/material";
import AudioTable from "@app/components/AudioTable";

import { Button } from "@mui/material";
import Transcript from "@app/components/Transcript";
import GetAudioTranscript from "@app/components/GetAudioTranscript";

const ListeningUploadandTranscribeAudio = () => {
  const audioTextContext = useContext(AudioTextContext);

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
        <Grid item xs={6}>
          {" "}
          <AudioTable />{" "}
        </Grid>
        <Grid item xs={6}>
          <GetAudioTranscript />
        </Grid>
      </Grid>
    </>
  );
};

export default ListeningUploadandTranscribeAudio;
