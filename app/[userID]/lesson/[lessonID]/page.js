"use client";
import React, { useEffect, useState, useContext } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContext } from "@app/contexts/DashboardContext";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import DnDSkillsContainer from "@app/components/PresentationPrep/DragAndDropSkills/DnDSkillsContainer";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import StageSorter from "@app/components/PresentationPrep/DragAndDropSkills/stage_sorter";

const page = ({ params }) => {
  const { updateLessonID, lessonID } = useContext(
    ReadingForGistAndDetailContext
  );
  //updateLessonID(params.lessonID);
  const userID = params.userID;
  //const lessonID = params.lessonID;
  const [lesson, setLesson] = useState(null);
  const { loadLessons } = useContext(DashboardContext);
  const { loggedInUser } = useContext(GlobalVariablesContext);
  useEffect(() => {
    //updateLessonID(params.lessonID);
    // if (lessonID) {
    //   // Fetch lesson details from localStorage or an API
    //   const storedLessons = JSON.parse(localStorage.getItem("lessons"));
    //   const lesson = storedLessons?.find((lesson) => lesson.id === lessonID);
    //   setLesson(lesson);
    // }
    async function fetchData() {
      try {
        const response = await loadLessons(
          params.userID,
          "getOneLesson",
          lessonID
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setLesson(data);
        console.log("Lessons data:", data.title);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

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
      <StageSorter />
    </div>
  );
};

export default page;
