import React from "react";
import { Grid } from "@mui/material";

const PreReadingGames = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        className="presentation-grid-container"
        direction={"row"}
        margin={0}
        spacing={0}
        padding={0}
        style={{ width: "60vw", borderColor: "white" }}
      >
        <Grid
          item
          sm={6}
          style={{
            backgroundColor: "blue",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            direction={"column"}
            style={{ height: "100%" }}
            padding={1}
          >
            <Grid
              item
              sm={4}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              game
            </Grid>
            <Grid
              item
              sm={4}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              game
            </Grid>
            <Grid
              item
              sm={4}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              game
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          sm={6}
          style={{
            backgroundColor: "red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container direction={"column"} style={{ height: "100%" }}>
            <Grid
              item
              sm={4}
              padding={1}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              <div
                style={{
                  width: "80%",
                  height: "80%",
                  backgroundColor: "yellow",
                }}
              ></div>
            </Grid>
            <Grid
              item
              sm={4}
              padding={1}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              game
            </Grid>
            <Grid
              item
              sm={4}
              padding={1}
              style={{ borderColor: "lightgray", borderWidth: 1 }}
            >
              game
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default PreReadingGames;
