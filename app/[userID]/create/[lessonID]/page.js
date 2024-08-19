"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState, useContext, useEffect } from "react";
// Dynamically import the PresentationDisplay component to ensure it only loads on the client side
const PresentationDisplay = dynamic(
  () => import("@app/components/PresentationDisplay"),
  { ssr: false }
);

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import { Handjet } from "next/font/google";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import ReadingForGistandDetailForm from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ReadingForGistandDetailForm";
import ListeningForGistAndDetail from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetail";

const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const page = ({ params }) => {
  const {
    fetchDataFromFirestore,
    getAllInputDataFromFirestore,
    updateLessonID,
    lessonID,
    getAllDiscussionDataFromFirestore,
    fetchTextbookDataFromDB,
    fetchIncludedDataFromFirestore,
  } = useContext(ReadingForGistAndDetailContext);

  const [lessonData, setLessonData] = useState({});
  const userID = params.userID;

  const [sectionNumber, setSectionNumber] = useState(0);
  const [sectionLength, setSectionLength] = useState(0);
  const [sectionComponentIndex, setSectionComponentIndex] = useState(0);
  const [currentStageFormIdx, setCurrentStageFormIdx] = useState(0);

  useEffect(() => {
    //updateLessonID(params.lessonID);
    console.log("CREATE PAGE USE EFFECT TRIGGERED");
    console.log("LESSON ID: " + lessonID);

    async function fetchData() {
      const res = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getOneLesson`
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

  const { presentationIsShowing } = useContext(GlobalVariablesContext);
  const [prevSectionLength, setPrevSectionLength] = useState([]);
  function arrowClick(dir) {
    console.log("arrow clicked");
    console.log("Section Number: " + sectionNumber);

    switch (dir) {
      case "right":
        if (sectionNumber < sectionLength - 1) {
          setSectionNumber(sectionNumber + 1);
        } else if (sectionNumber === sectionLength - 1) {
          updateSectionLengthsArray(currentStageFormIdx, sectionLength);
          setSectionNumber(0);
          setCurrentStageFormIdx(currentStageFormIdx + 1);
          console.log("Current Stage Form Index: " + currentStageFormIdx);
        }
        break;
      case "left":
        //setSectionNumber(sectionNumber - 1);

        if (sectionNumber === 0 && currentStageFormIdx > 0) {
          setSectionNumber(prevSectionLength[currentStageFormIdx - 1] - 1);
          setCurrentStageFormIdx(currentStageFormIdx - 1);
        } else if (sectionNumber > 0) {
          setSectionNumber(sectionNumber - 1);
        }

        break;

      default:
        break;
    }
  }

  const getSectionsLength = (length) => {
    console.log(length);
    setSectionLength(length);
  };
  // const getSectionsLength = (length) => {
  //   console.log("Received section length: " + length);
  //   setSectionLength(length); // Set the section length in state
  // };

  const stageOrder = [
    {
      stageName: "Reading For Gist and Detail",
      component: (
        <ReadingForGistandDetailForm
          sectionNumber={sectionNumber}
          getSectionsLength={getSectionsLength}
        />
      ),
      //stageFormLength: 5,
    },
    {
      stageName: "Listening for Gist and Detail",

      component: (
        <ListeningForGistAndDetail
          getSectionsLength={getSectionsLength}
          section={sectionNumber}
        />
      ),
      stageFormLength: getSectionsLength,
    },
  ];

  const updateSectionLengthsArray = (idx, newValue) => {
    // Create a copy of the array
    const updatedArray = [...prevSectionLength];
    updatedArray[idx] = newValue;
    console.log("Updated Array: " + updatedArray);

    setPrevSectionLength(updatedArray);
  };

  const numberOfStageForms = stageOrder.length;
  return (
    <div className="test-border">
      <Head style={{ backgroundColor: "red" }}>
        <title style={{ font: "white" }}>Lesson generator</title>
      </Head>

      {presentationIsShowing ? (
        <PresentationDisplay />
      ) : (
        <div
          style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}
        >
          <h1 className="ml-20">{lessonData.title}</h1>
          <h1>{lessonID || "no lessonID"}</h1>

          {/* <ReadingForGistandDetailForm
            sectionNumber={sectionNumber}
            getSectionLength={getSectionLength}
          /> */}
          {"Section Length: " + sectionLength}
          {"     sectionNumber: " + sectionNumber}
          {"     currentStageFormIdx: " + currentStageFormIdx}
          {"     number of stages : " + numberOfStageForms}
          {stageOrder[currentStageFormIdx].component}
          {JSON.stringify(prevSectionLength)}

          {/* {stageOrder.map((stage, index) => {
            const Component = ComponentMap[stage];
            return Component ? <Component key={index} /> : null;
          })} */}
          {sectionNumber < sectionLength - 1 ||
          currentStageFormIdx < stageOrder.length - 1 ? (
            <button
              //onClick={() => setSectionNumber(sectionNumber + 1)}
              onClick={() => arrowClick("right")}
              className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-left pl-3"
            >
              <ArrowForwardIosIcon />
            </button>
          ) : null}
          {sectionNumber === 0 && currentStageFormIdx === 0 ? null : (
            <button
              // onClick={() => setSectionNumber(sectionNumber - 1)}
              onClick={() => arrowClick("left")}
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
