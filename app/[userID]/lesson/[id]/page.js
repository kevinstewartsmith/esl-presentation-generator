"use client";
import React, { useEffect, useState, useContext } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContext } from "@app/contexts/DashboardContext";

const page = ({ params }) => {
  const userID = params.userID;
  const lessonID = params.id;
  const [lesson, setLesson] = useState(null);
  const { loadLessons } = useContext(DashboardContext);
  useEffect(() => {
    if (lessonID) {
      // Fetch lesson details from localStorage or an API
      const storedLessons = JSON.parse(localStorage.getItem("lessons"));
      const lesson = storedLessons?.find((lesson) => lesson.id === lessonID);
      setLesson(lesson);
    }
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
  }, [lessonID]);

  // if (!lesson) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>{params.id}</h1>
      <h1>{lesson ? lesson.title : "No title"}</h1>
      {/* <h1>{lesson.title}</h1> */}
      <h1> This is where you arrange Sections of a lesson</h1>
      <Link href={`/${userID}/create/${lessonID}`}>
        <button>Make Lesson</button>
      </Link>
    </div>
  );
};

export default page;
