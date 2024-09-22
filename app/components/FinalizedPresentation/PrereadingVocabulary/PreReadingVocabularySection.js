"use client";
import React, { useContext } from "react";
//import next/font/google
import { Lobster_Two } from "next/font/google";
import { Andada_Pro } from "next/font/google";
import { and } from "firebase/firestore";
import { Grid } from "@mui/material";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const lobsterTwo = Lobster_Two({
  subsets: ["latin"],
  weight: ["400", "700"], // Use the singular `weight` property
  display: "swap",
});

const andadaPro = Andada_Pro({
  subsets: ["latin"],
  weight: ["400", "700"], // Use the singular `weight` property
  display: "swap",
});

const PreReadingVocabularySection = () => {
  //console.log("vocabularyPRES: " + JSON.stringify(vocabulary));
  const { vocabulary } = useContext(ReadingForGistAndDetailContext);
  return (
    <>
      {vocabulary.map(
        (word, index) =>
          word.selected === true && (
            <section
              //data-background-color="red"
              data-font-family={andadaPro.family}
              key={index}
              //className={andadaPro.className}
            >
              <Grid container spacing={0} direction={"column"}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className="flex items-center justify-center"
                >
                  <img
                    style={{ height: "60vh", width: "auto" }}
                    src={word.img_url}
                    alt={word.img_ur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <h2
                    data-font-family={andadaPro.family}
                    //className={andadaPro.className}
                    //style={{ fontFamily: andadaPro.family }}
                  >
                    {word.word}
                  </h2>
                </Grid>
              </Grid>
            </section>
          )
      )}
    </>
  );
};

export default PreReadingVocabularySection;
