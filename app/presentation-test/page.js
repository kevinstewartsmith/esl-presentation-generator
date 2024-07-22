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

const PresentationTest = () => {
  //const [showPresentation, setShowPresentation] = useState(false);
  const { updateShowPresentation, showPresentation } =
    useContext(PresentationContext);

  const [presData, setPresData] = useState({
    gistReading: {
      book: "Student Book",
      page: 23,
      title: "My Cat, the Hero",
      question: "What is the name of Hercules' cat?",
      timeLimit: 2,
    },
    detailReading: {
      book: "Student Book",
      page: 23,
      title: "My Cat, the Hero",
      exercises: 5,
      timeLimit: 6,
    },
    gistPartnerCheck: {
      question: "What did you put for number 1?",
      answer: "I put ...",
    },
    detailPartnerCheck: {
      question: "What did you put for number 5?",
      answer: "I put ...",
    },
  });

  // const updateGistReadingTimeLimit = (event, newTimeLimit) => {
  //   setPresData((prevState) => ({
  //     ...prevState,
  //     gistReading: {
  //       ...prevState.gistReading,
  //       timeLimit: newTimeLimit,
  //     },
  //   }));
  //   console.log(presData.gistReading.timeLimit);
  // };

  // const updateGistPage = (event, newPage) => {
  //   setPresData((prevState) => ({
  //     ...prevState,
  //     gistReading: {
  //       ...prevState.gistReading,
  //       page: newPage,
  //     },
  //   }));
  //   console.log(presData.gistReading.page);
  // };
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
        <PresentationDisplay presData={presData} />
      ) : (
        <div
          style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}
        >
          <div
            style={{
              backgroundColor: "white",
              height: 50,
              display: "flex",
              alignItems: "center",

              marginLeft: 0,
            }}
          >
            <h1
              style={{
                color: "#3C5997",

                marginTop: 0,
                marginLeft: 20,
                marginBottom: 0,
              }}
            >
              {"Reading "}
            </h1>
            <NetworkCheckIcon
              style={{ marginLeft: 3, marginRight: 3, color: "#3C5997" }}
            />{" "}
            <h1 style={{ color: "#3C5997" }}>{" Exercise Generator"}</h1>
          </div>
          {/* <ReadingContent />
        <SectionSelector /> */}
          <div
            style={{
              backgroundColor: "white",
              height: "100vh - 50px",
              display: "flex",
              top: 50,
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
            className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-left"
          >
            <ArrowForwardIosIcon />
          </button>
          <button
            onClick={() => setSectionNumber(sectionNumber - 1)}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-right"
          >
            <ArrowBackIosIcon sx={{}} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PresentationTest;
