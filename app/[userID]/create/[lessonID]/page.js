"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, useContext, useEffect, use } from "react";
const PresentationDisplay = dynamic(
  () => import("@app/components/PresentationDisplay"),
  { ssr: false },
);
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Handjet } from "next/font/google";
import { PresentationContext } from "@app/contexts/PresentationContext";
import ComponentMap from "@app/utils/ComponentMap";
import HorizontalNonLinearStepper from "@app/components/PresentationPrep/CreatePageComponents/HorizontalNonLinearStepper";
import { Anton } from "next/font/google";
import { PresentationContextProvider } from "@app/contexts/PresentationContext";
import { useLessonStore } from "@app/stores/useLessonStore";
import { useStageOrderStore } from "@app/stores/useStageOrderStore";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});
const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const CreatePageComponent = ({ params }) => {
  const presentationIsShowing = useLessonStore((s) => s.presentationIsShowing);
  const updateLessonTitle = useLessonStore((s) => s.updateLessonTitle);

  const items = useStageOrderStore((s) => s.items);
  const setHydratedItems = useStageOrderStore((s) => s.setHydratedItems);

  const [lessonData, setLessonData] = useState({});

  const resolvedParams = use(params);
  const { userID, stageID, lessonID: paramsLessonID } = resolvedParams;

  const [sectionNumber, setSectionNumber] = useState(0);
  const [sectionLength, setSectionLength] = useState(0);
  const [currentStageFormIdx, setCurrentStageFormIdx] = useState(0);
  const [includedStages, setIncludedStages] = useState([]);

  const setCurrentLessonID = useLessonStore(
    (state) => state.setCurrentLessonID,
  );
  const setCurrentUserID = useLessonStore((state) => state.setCurrentUserID);

  function renderComponent() {
    const stageTitle = includedStages
      ? includedStages[currentStageFormIdx]
      : null;
    const ComponentToRender = ComponentMap[stageTitle];
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
    setCurrentUserID(userID);
    setCurrentLessonID(paramsLessonID);

    async function fetchData() {
      const res = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${paramsLessonID}&method=getOneLesson`,
      );
      const data = await res.json();
      setLessonData(data);
      getLessonTitle(data.title);
    }
    fetchData();

    async function getLessonStages() {
      try {
        const response = await fetch(
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${paramsLessonID}`,
        );
        const data = await response.json();
        setHydratedItems(data);
        setIncludedStages([...data.root, "Start Presentation"]);
      } catch (error) {
        console.error(error);
      }
    }

    getLessonStages();
  }, []);

  function getLessonTitle(title) {
    updateLessonTitle(title);
  }

  const [prevSectionLength, setPrevSectionLength] = useState([]);
  function arrowClick(dir) {
    switch (dir) {
      case "right":
        if (sectionNumber < sectionLength - 1) {
          setSectionNumber(sectionNumber + 1);
        } else if (sectionNumber === sectionLength - 1) {
          updateSectionLengthsArray(currentStageFormIdx, sectionLength);
          setSectionNumber(0);
          setCurrentStageFormIdx(currentStageFormIdx + 1);
        }
        break;
      case "left":
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
    setSectionLength(length);
  };

  const updateSectionLengthsArray = (idx, newValue) => {
    const updatedArray = [...prevSectionLength];
    updatedArray[idx] = newValue;
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
  <PresentationContextProvider>
    <CreatePageComponent {...props} />
  </PresentationContextProvider>
);
export default page;
