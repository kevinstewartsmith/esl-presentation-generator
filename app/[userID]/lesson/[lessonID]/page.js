"use client";
import React, { useEffect, useState, useContext, use } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContext } from "@app/contexts/DashboardContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import DnDSkillsContainer from "@app/components/PresentationPrep/DragAndDropSkills/DnDSkillsContainer";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import { ThinkPairShareContext } from "@app/contexts/ThinkPairShareContext";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import StageSorter from "@app/components/PresentationPrep/DragAndDropSkills/stage_sorter";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { usePathname } from "next/navigation";
import { DashboardContextProvider } from "@app/contexts/DashboardContext";
import { PresentationContextProvider } from "@app/contexts/PresentationContext";
import { useLessonStore } from "@app/stores/UseLessonStore";

const LessonPageComponent = ({ params }) => {
  const pathname = usePathname();
  const { currentUserID, setCurrentLessonID, currentLessonID } =
    useLessonStore();

  console.log("Router: ", pathname);
  const { updateLessonID, lessonID } = useContext(
    ReadingForGistAndDetailContext
  );
  const { updateThinkPairShareLessonID } = useContext(ThinkPairShareContext);
  const { updateLessonIDForAudioData } = useContext(AudioTextContext);

  const {
    updateLessonIDPresentationContext,
    updateStages,
    updateItems,
    items,
  } = useContext(PresentationContext);
  //updateLessonID(params.lessonID);

  //const resolvedParams = React.use(params);
  const { userID, lessonID: paramsLessonID } = params;
  //const userID = resolvedParams.userID;
  //const paramsLessonID = resolvedParams.lessonID;
  //const lessonID = params.lessonID;
  const [lesson, setLesson] = useState(null);
  const { loadLessons } = useContext(DashboardContext);
  const { loggedInUser, lessonTitle, updateLessonTitle, updatePathname } =
    useContext(GlobalVariablesContext);

  updateLessonID(paramsLessonID);
  updateLessonIDForAudioData(paramsLessonID);
  updateThinkPairShareLessonID(paramsLessonID);

  //setCurrentLessonID(paramsLessonID);

  //update currentLessonID in lesson store with useEffect
  useEffect(() => {
    setCurrentLessonID(paramsLessonID);
  }, [paramsLessonID]);

  useEffect(() => {
    updatePathname(pathname);
    async function fetchData() {
      try {
        const response = await loadLessons(
          userID,
          "getOneLesson",
          paramsLessonID
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setLesson(data);
        getLessonTitle(data.title);
        //updateItems(data);
        console.log("Lessons data:", data.title);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();

    async function getLessonStages() {
      try {
        const response = await fetch(
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${paramsLessonID}`
        );
        const data = await response.json();
        console.log("Lesson Stages:", data.root[0]);

        updateItems(data);
      } catch (error) {
        console.error(error);
      }
    }
    getLessonStages();
  }, [lessonID]);
  function getLessonTitle(title) {
    console.log("Lesson Title: " + title);
    updateLessonTitle(title);
  }

  return (
    <div>
      <h1>{"Zustand Store: " + currentUserID}</h1>
      <h1>{"ZustandLesson ID: " + currentLessonID}</h1>
      <h1>{lessonID}</h1>
      <h1>{lesson ? lesson.title : "No title"}</h1>
      {/* <h1>{lesson.title}</h1> */}
      <h1> This is where you arrange Sections of a lesson</h1>
      <Link href={`/${userID}/create/${lessonID}`}>
        <button>Make Lesson</button>
      </Link>
      <h1>React Beautiful</h1>
      <StageSorter lessonID={paramsLessonID} />
    </div>
  );
};

const page = (props) => (
  <DashboardContextProvider>
    <PresentationContextProvider>
      <LessonPageComponent {...props} />
    </PresentationContextProvider>
  </DashboardContextProvider>
);
export default page;
