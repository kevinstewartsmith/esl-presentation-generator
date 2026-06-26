"use client";
import React from "react";
import { Lobster_Two } from "next/font/google";
import { Andada_Pro } from "next/font/google";
import { Grid } from "@mui/material";
import { useReadingStore } from "@app/stores/useReadingStore";

const lobsterTwo = Lobster_Two({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const andadaPro = Andada_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const PreReadingVocabularySection = () => {
  const vocabulary = useReadingStore((state) => state.readingVocab);

  return (
    <>
      {vocabulary.map(
        (word, index) =>
          word.selected === true && (
            <section data-font-family={andadaPro.family} key={index}>
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
                    alt={word.word}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <h2 data-font-family={andadaPro.family}>{word.word}</h2>
                </Grid>
              </Grid>
            </section>
          ),
      )}
    </>
  );
};

export default PreReadingVocabularySection;
