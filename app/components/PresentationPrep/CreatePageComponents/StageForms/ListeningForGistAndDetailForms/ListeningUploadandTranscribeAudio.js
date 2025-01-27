import React, { useContext } from "react";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import { Grid } from "@mui/material";

import { Button } from "@mui/material";

const ListeningUploadandTranscribeAudio = () => {
  const audioTextContext = useContext(AudioTextContext);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ border: "1px solid orange" }}
    >
      <Grid item>ListeningUploadandTranscribeAudio Component</Grid>
    </Grid>
  );
};

export default ListeningUploadandTranscribeAudio;
