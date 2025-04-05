"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useContext, useEffect, use } from "react";
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
import { PresentationContext } from "@app/contexts/PresentationContext";

import { usePathname } from "next/navigation";
import ReadingForGistandDetailForm from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ReadingForGistandDetailForm";
import ListeningForGistAndDetail from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetail";
import ComponentMap from "@app/utils/ComponentMap";
import PresSectionComponentMap from "@app/utils/PresSectionComponentMap";
import HorizontalNonLinearStepper from "@app/components/PresentationPrep/CreatePageComponents/HorizontalNonLinearStepper";
import { Anton } from "next/font/google";
import { DashboardContextProvider } from "@app/contexts/DashboardContext";
import { PresentationContextProvider } from "@app/contexts/PresentationContext";
import { AudioTextProvider } from "@app/contexts/AudioTextContext";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import { unstable_gridTabIndexColumnHeaderFilterSelector } from "@node_modules/@mui/x-data-grid";

//import Anton font from next font
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});
const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const CreatePageComponent = ({ params }) => {
  const {
    presentationIsShowing,
    lessonTitle,
    updateLessonTitle,
    updatePathname,
  } = useContext(GlobalVariablesContext);
  const {
    fetchDataFromFirestore,
    getAllInputDataFromFirestore,
    updateLessonID,
    lessonID,
    getAllDiscussionDataFromFirestore,
    fetchTextbookDataFromDB,
    fetchIncludedDataFromFirestore,
  } = useContext(ReadingForGistAndDetailContext);

  const { lessonIDAudioContext, fetchAudioQuestionDataFromDB } =
    useContext(AudioTextContext);

  const pathname = usePathname();

  const { items, updateItems } = useContext(PresentationContext);

  const [lessonData, setLessonData] = useState({});

  // const resolvedParams = React.use(params);
  // const userID = resolvedParams.userID;
  //const { userID, lessonID: paramsLessonID } = params;
  const { userID, stageID } = params;

  const [sectionNumber, setSectionNumber] = useState(0);
  const [sectionLength, setSectionLength] = useState(0);
  const [sectionComponentIndex, setSectionComponentIndex] = useState(0);
  const [currentStageFormIdx, setCurrentStageFormIdx] = useState(0);
  const [includedStages, setIncludedStages] = useState([]);

  //Render a component based on the current stage form index
  function renderComponent(componentName, idx) {
    const stageTitle = includedStages
      ? includedStages[currentStageFormIdx]
      : null;
    const ComponentToRender = ComponentMap[stageTitle];
    //const ComponentToRender = ReadingForGistandDetailForm;
    if (!ComponentToRender) {
      return <div>Component not found</div>;
    }

    return (
      <ComponentToRender
        section={sectionNumber}
        getSectionsLength={getSectionsLength}
      />
    );
  }

  useEffect(() => {
    updatePathname(pathname);
    //updateLessonID(params.lessonID);
    console.log("CREATE PAGE USE EFFECT TRIGGERED");
    console.log("LESSON ID: " + lessonID);
    console.log("LESSON ID AUDIO CONTEXT: " + lessonIDAudioContext);

    async function fetchData() {
      const res = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getOneLesson`
      );
      const data = await res.json();
      console.log("LESSON DATA CREATE");
      console.log(data);
      setLessonData(data);
      getLessonTitle(data.title);
    }
    fetchData();
    getAllInputDataFromFirestore(userID, lessonID, params.stageID);
    getAllDiscussionDataFromFirestore(userID, lessonID, params.stageID);
    fetchTextbookDataFromDB(userID, lessonID, params.stageID);
    fetchIncludedDataFromFirestore(userID, lessonID, params.stageID);
    fetchAudioQuestionDataFromDB(userID, lessonID, params.stageID);

    async function getLessonStages() {
      try {
        const response = await fetch(
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${lessonID}`
        );
        const data = await response.json();
        console.log("Lesson Stages:", data.root[0]);
        console.log(typeof data.root[0]);

        console.log("Items: " + JSON.stringify(data.root[0]));

        updateItems(data);
        //setIncludedStages(data.root);
        setIncludedStages([...data.root, "Start Presentation"]);
        //makeStageArray(data.root);
      } catch (error) {
        console.error(error);
      }
    }

    getLessonStages();

    function makeStageArray(data) {
      console.log("Make Stage Array");
      console.log(data);

      setIncludedStages(data);
      //setIncludedStages(data.root);
    }
    //makeStageArray();
  }, []);

  function getLessonTitle(title) {
    console.log("Lesson Title: " + title);
    updateLessonTitle(title);
  }

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

  const updateSectionLengthsArray = (idx, newValue) => {
    // Create a copy of the array
    const updatedArray = [...prevSectionLength];
    updatedArray[idx] = newValue;
    console.log("Updated Array: " + updatedArray);

    setPrevSectionLength(updatedArray);
  };
  const itemsArray = Object.values(items);
  const numberOfStageForms = itemsArray.length;

  return (
    <div className="test-border">
      <Head style={{ backgroundColor: "red" }}>
        <title style={{ font: "white" }}>Lesson generator</title>
      </Head>

      {presentationIsShowing ? (
        <PresentationDisplay includedStages={includedStages} />
      ) : (
        <div
          style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}
        >
          {renderComponent()}

          <HorizontalNonLinearStepper
            steps={includedStages ? includedStages : null}
            activeStep={currentStageFormIdx ? currentStageFormIdx : 0}
          />

          {sectionNumber < sectionLength - 1 ||
          currentStageFormIdx < includedStages.length - 1 ? (
            <button
              onClick={() => arrowClick("right")}
              className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full arrows arrow-left pl-3"
            >
              <ArrowForwardIosIcon />
            </button>
          ) : null}

          {sectionNumber === 0 && currentStageFormIdx === 0 ? null : (
            <button
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
const page = (props) => (
  <DashboardContextProvider>
    <PresentationContextProvider>
      <CreatePageComponent {...props} />
    </PresentationContextProvider>
  </DashboardContextProvider>
);
export default page;
