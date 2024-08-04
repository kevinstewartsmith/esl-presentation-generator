"use client";
import React, { useEffect, useState, useContext } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardContext } from "@app/contexts/DashboardContext";

const page = ({ params }) => {
  const lessonId = params.id;
  const [lesson, setLesson] = useState(null);
  const { loadLessons } = useContext(DashboardContext);
  useEffect(() => {
    if (lessonId) {
      // Fetch lesson details from localStorage or an API
      const storedLessons = JSON.parse(localStorage.getItem("lessons"));
      const lesson = storedLessons?.find((lesson) => lesson.id === lessonId);
      setLesson(lesson);
    }
    async function fetchData() {
      try {
        const response = await loadLessons(params.userID, "getOneLesson");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        console.log("Lessons data:", data[0].title);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [lessonId]);

  // if (!lesson) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>{params.id}</h1>
      <h1>{JSON.stringify(lesson)}</h1>
      {/* <h1>{lesson.title}</h1> */}
      <Link href={`/create/${lessonId}`}>
        <button>Make Lesson</button>
      </Link>
    </div>
  );
};

export default page;
