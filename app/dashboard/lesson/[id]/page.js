"use client";
import React, { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import Link from "next/link";

const page = ({ params }) => {
  const lessonId = params.id;
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (lessonId) {
      // Fetch lesson details from localStorage or an API
      const storedLessons = JSON.parse(localStorage.getItem("lessons"));
      const lesson = storedLessons?.find((lesson) => lesson.id === lessonId);
      setLesson(lesson);
    }
  }, [lessonId]);

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{params.id}</h1>
      <h1>{JSON.stringify(lesson)}</h1>
      <h1>{lesson.title}</h1>
      <Link href={`/create/${lessonId}`}>
        <button>Make Lesson</button>
      </Link>
    </div>
  );
};

export default page;
