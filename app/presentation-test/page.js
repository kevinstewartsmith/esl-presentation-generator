// pages/presentation-test.js
"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useContext } from "react";
// Dynamically import the PresentationDisplay component to ensure it only loads on the client side
const PresentationDisplay = dynamic(
  () => import("../components/PresentationDisplay"),
  { ssr: false }
);
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import AddTextBook from "../components/PresentationPrep/AddTextBook";
import ReadingContent from "@app/components/PresentationPrep/ReadingContent";
import SectionSelector from "@app/components/PresentationPrep/SectionSelector";
import PreReadingVocabSlides from "@app/components/PresentationPrep/PreReadingVocabSlides";
import PreReadingGames from "@app/components/PresentationPrep/PreReadingGames";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import FinishReading from "@app/components/SectionSelector/FinishReading";
import { PresentationContext } from "@app/contexts/PresentationContext";
import StegaIcon from "@app/components/StegaIcon";
import { Handjet } from "next/font/google";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";

const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const PresentationTest = () => {
  //const [showPresentation, setShowPresentation] = useState(false);
  const { updateShowPresentation, showPresentation } =
    useContext(PresentationContext);

  const sections = [
    <ReadingContent />,
    <SectionSelector />,
    <PreReadingVocabSlides />,
    <PreReadingGames />,
    <FinishReading />,
  ];
  const [sectionNumber, setSectionNumber] = useState(0);
  return (
    <div className="test-border">
      <Head style={{ backgroundColor: "red" }}>
        <title style={{ font: "white" }}>Reveal.js with Next.js</title>
      </Head>

      {showPresentation ? (
        <PresentationDisplay />
      ) : (
        <div
          style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}
        >
          <div
            style={{
              backgroundColor: "white",
              height: "100vh - 50px",
              display: "flex",
              top: 30,
              justifyContent: "center",
              alignItems: "center",

              //borderColor: "yellow",
              borderWidth: 0,
            }}
          >
            {sections[sectionNumber]}
          </div>
          <button
            onClick={() => setSectionNumber(sectionNumber + 1)}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-left pl-3"
          >
            <ArrowForwardIosIcon />
          </button>
          <button
            onClick={() => setSectionNumber(sectionNumber - 1)}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-right pl-4"
          >
            <ArrowBackIosIcon sx={{}} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PresentationTest;
