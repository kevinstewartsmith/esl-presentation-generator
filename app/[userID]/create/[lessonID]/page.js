// pages/presentation-test.js
"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useContext, useEffect } from "react";
// Dynamically import the PresentationDisplay component to ensure it only loads on the client side
const PresentationDisplay = dynamic(
  () => import("@app/components/PresentationDisplay"),
  { ssr: false }
);
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import AddTextBook from "@app/components/PresentationPrep/AddTextBook";
import ReadingContent from "@app/components/PresentationPrep/ReadingContent";
import SectionSelector from "@app/components/PresentationPrep/SectionSelector";
import PreReadingVocabSlides from "@app/components/PresentationPrep/PreReadingVocabSlides";
import PreReadingGames from "@app/components/PresentationPrep/PreReadingGames";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import FinishReading from "@app/components/SectionSelector/FinishReading";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import StegaIcon from "@app/components/StegaIcon";
import { Handjet } from "next/font/google";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { readingForGistandDetailStage } from "@app/utils/SectionIDs";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const page = ({ params }) => {
  console.log("WHY TF Lesson ID: ", params.lessonID);
  const {
    fetchDataFromFirestore,
    getAllInputDataFromFirestore,
    updateLessonID,
    lessonID,
    getAllDiscussionDataFromFirestore,
    fetchTextbookDataFromDB,
    fetchIncludedDataFromFirestore,
  } = useContext(ReadingForGistAndDetailContext);

  console.log("Stage ID: ", readingForGistandDetailStage);
  const [lessonData, setLessonData] = useState({});
  const userID = params.userID;
  //const lessonID = params.lessonID;

  useEffect(() => {
    //updateLessonID(params.lessonID);
    updateLessonID(params.lessonID);
    console.log("CREATE PAGE USE EFFECT");
    console.log("Params Lesson ID: ", params.lessonID);
    console.log("LesSon ID: ", lessonID);
    async function fetchData() {
      const res = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${params.lessonID}&method=getOneLesson`
      );
      const data = await res.json();
      console.log("LESSON DATA CREATE");
      console.log(data);
      setLessonData(data);
    }
    fetchData();
    getAllInputDataFromFirestore(
      params.userID,
      params.lessonID,
      params.stageID
    );
    getAllDiscussionDataFromFirestore(
      params.userID,
      params.lessonID,
      params.stageID
    );
    fetchTextbookDataFromDB(params.userID, params.lessonID, params.stageID);
    fetchIncludedDataFromFirestore(
      params.userID,
      params.lessonID,
      params.stageID
    );
  }, []);

  const { presentationIsShowing, hidePresentation, loggedInUser } = useContext(
    GlobalVariablesContext
  );

  function arrowClick(dir) {
    console.log("arrow clicked");
    switch (dir) {
      case "left":
        setSectionNumber(sectionNumber + 1);
        break;
      case "right":
        setSectionNumber(sectionNumber - 1);
        break;

      default:
        break;
    }
  }

  const sections = [
    <ReadingContent stageID={readingForGistandDetailStage} />,
    <SectionSelector stageID={readingForGistandDetailStage} />,
    <PreReadingVocabSlides
      stageID={readingForGistandDetailStage}
      lessonID={params.lessonID}
    />,
    <PreReadingGames stageID={readingForGistandDetailStage} />,
    <FinishReading stageID={readingForGistandDetailStage} />,
  ];
  const [sectionNumber, setSectionNumber] = useState(0);
  return (
    <div className="test-border">
      <Head style={{ backgroundColor: "red" }}>
        <title style={{ font: "white" }}>Reveal.js with Next.js</title>
      </Head>

      {presentationIsShowing ? (
        <PresentationDisplay />
      ) : (
        <div
          style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}
        >
          <h1 className="ml-20">{lessonData.title}</h1>
          <h1>{lessonID || "no lessonID"}</h1>
          <div
            style={{
              backgroundColor: "white",
              height: "100vh - 50px",
              display: "flex",
              top: 10,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0,
            }}
          >
            {sections[sectionNumber]}
          </div>
          {sectionNumber < sections.length - 1 ? (
            <button
              //onClick={() => setSectionNumber(sectionNumber + 1)}
              onClick={() => arrowClick("left")}
              className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-left pl-3"
            >
              <ArrowForwardIosIcon />
            </button>
          ) : null}
          {sectionNumber === 0 ? null : (
            <button
              // onClick={() => setSectionNumber(sectionNumber - 1)}
              onClick={() => arrowClick("right")}
              className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-right pl-4"
            >
              <ArrowBackIosIcon sx={{}} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
