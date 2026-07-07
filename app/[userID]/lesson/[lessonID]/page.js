"use client";
import React, { useEffect, useState, useContext, use } from "react";
import Link from "next/link";
import DnDSkillsContainer from "@app/components/PresentationPrep/DragAndDropSkills/DnDSkillsContainer";
import StageSorter from "@app/components/PresentationPrep/DragAndDropSkills/stage_sorter";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { PresentationContextProvider } from "@app/contexts/PresentationContext";
import { useLessonStore } from "@app/stores/useLessonStore";
import { loadLessons } from "@app/utils/lessonApi";

const LessonPageComponent = ({ params }) => {
  const currentUserID = useLessonStore((s) => s.currentUserID);
  const currentLessonID = useLessonStore((s) => s.currentLessonID);
  const setCurrentLessonID = useLessonStore((s) => s.setCurrentLessonID);
  const updateLessonTitle = useLessonStore((s) => s.updateLessonTitle);

  const { updateItems } = useContext(PresentationContext);

  const resolvedParams = use(params);
  const { userID, lessonID: paramsLessonID } = resolvedParams;

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    setCurrentLessonID(paramsLessonID);
  }, [paramsLessonID]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await loadLessons(
          userID,
          "getOneLesson",
          paramsLessonID,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLesson(data);
        updateLessonTitle(data.title);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();

    async function getLessonStages() {
      try {
        const response = await fetch(
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${paramsLessonID}`,
        );
        const data = await response.json();
        updateItems(data);
      } catch (error) {
        console.error(error);
      }
    }
    getLessonStages();
  }, [paramsLessonID]);

  return (
    <div>
      <h1>{"Zustand Store: " + currentUserID}</h1>
      <h1>{"ZustandLesson ID: " + currentLessonID}</h1>
      <h1>{currentLessonID}</h1>
      <h1>{lesson ? lesson.title : "No title"}</h1>
      <h1> This is where you arrange Sections of a lesson</h1>
      <Link href={`/${userID}/create/${paramsLessonID}`}>
        <button>Make Lesson</button>
      </Link>
      <h1>React Beautiful</h1>
      <StageSorter lessonID={paramsLessonID} />
    </div>
  );
};

const page = (props) => (
  <PresentationContextProvider>
    <LessonPageComponent {...props} />
  </PresentationContextProvider>
);
export default page;
