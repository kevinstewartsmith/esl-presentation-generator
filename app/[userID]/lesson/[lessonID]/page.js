"use client";
import React, { useEffect, useState, useContext } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContext } from "@app/contexts/DashboardContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import DnDSkillsContainer from "@app/components/PresentationPrep/DragAndDropSkills/DnDSkillsContainer";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import StageSorter from "@app/components/PresentationPrep/DragAndDropSkills/stage_sorter";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { usePathname } from "next/navigation";
import { DashboardContextProvider } from "@app/contexts/DashboardContext";
import { PresentationContextProvider } from "@app/contexts/PresentationContext";

const LessonPageComponent = ({ params }) => {
  const pathname = usePathname();

  console.log("Router: ", pathname);
  const { updateLessonID, lessonID } = useContext(
    ReadingForGistAndDetailContext
  );
  const {
    updateLessonIDPresentationContext,
    updateStages,
    updateItems,
    items,
  } = useContext(PresentationContext);
  //updateLessonID(params.lessonID);
  const userID = params.userID;
  //const lessonID = params.lessonID;
  const [lesson, setLesson] = useState(null);
  const { loadLessons } = useContext(DashboardContext);
  const { loggedInUser, lessonTitle, updateLessonTitle, updatePathname } =
    useContext(GlobalVariablesContext);
  updateLessonID(params.lessonID);
  useEffect(() => {
    updatePathname(pathname);
    async function fetchData() {
      try {
        const response = await loadLessons(
          params.userID,
          "getOneLesson",
          params.lessonID
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
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${params.lessonID}`
        );
        const data = await response.json();
        console.log("Lesson Stages:", data.root[0]);
        //get first item of data.root

        //const strings = data.root.map((obj) => Object.values(obj)[0]);
        //console.log("Strings:", strings);
        //updateStages(data);
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
      <h1>{lessonID}</h1>
      <h1>{lesson ? lesson.title : "No title"}</h1>
      {/* <h1>{lesson.title}</h1> */}
      <h1> This is where you arrange Sections of a lesson</h1>
      <Link href={`/${userID}/create/${lessonID}`}>
        <button>Make Lesson</button>
      </Link>
      <h1>React Beautiful</h1>
      <StageSorter lessonID={params.lessonID} />
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
