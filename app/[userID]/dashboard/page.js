"use client";
import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import LessonCard from "@app/components/DashboardComponents/LessonCard";
import AddIcon from "@mui/icons-material/Add";
import LessonModal from "@app/components/DashboardComponents/lessonModal";
import { v4 as uuidv4 } from "uuid";
import { DashboardContext } from "@app/contexts/DashboardContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const page = ({ params }) => {
  const { loadLessons, deleteLessonFromDB, addNewLesson } =
    useContext(DashboardContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [lessons, setLessons] = useState([]);
  console.log("Page Params:", params.userID);
  const userID = params.userID;

  useEffect(() => {
    // const lessons = localStorage.getItem("lessons");
    // if (lessons) {
    //   setLessons(JSON.parse(lessons));
    // }
    async function fetchData() {
      try {
        const response = await loadLessons(params.userID, "getAllLessons");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        //console.log("Lessons data:", data);
        //console.log("Lesson data type:", typeof data);
        setLessons(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const addLesson = (title) => {
    const lessonId = uuidv4();
    console.log("Lesson ID: ", lessonId);
    const newLesson = {
      id: lessonId,
      title: title,
      description: "This is a new lesson",
    };

    setLessons([...lessons, newLesson]);
    console.log(lessons);

    handleClose();

    async function dbAddLesson() {
      try {
        const response = await addNewLesson(userID, title);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response; // Parse the JSON response
        //console.log("Lessons data:", data[0].title);
        console.log(JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }
    dbAddLesson();
  };

  function deleteLesson(lessonID) {
    if (confirm("Are you sure you want to delete this lesson?")) {
      console.log("delete lesson");
      console.log(lessonID);

      const newLessons = lessons.filter((lesson) => lesson.id !== lessonID);
      setLessons(newLessons);
      const lessonString = JSON.stringify(newLessons);
      if (typeof window !== "undefined") {
        localStorage.setItem("lessons", lessonString);
      }

      //Delete lesson from database
      async function dbDeleteLeeson() {
        try {
          const response = await deleteLessonFromDB(userID, lessonID);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response;
          console.log("Lessons data:", data[0].title);
        } catch (error) {
          console.error(error);
        }
      }
      dbDeleteLeeson();
      console.log("User clicked OK");
    } else {
      // User clicked Cancel
      console.log("User clicked Cancel");
    }
  }

  return (
    <div style={{ marginLeft: 40, marginRight: 40 }}>
      <h1>{params.userID}</h1>
      <Grid container spacing={0}>
        {lessons.map((lesson, index) => (
          <Grid item xs={3} padding={2} key={index}>
            <LessonCard
              key={index}
              deleteLesson={deleteLesson}
              lesson={lesson}
              userID={params.userID}
              onClick={() => console.log(lesson.id)}
            />
          </Grid>
        ))}
      </Grid>
      <button
        //onClick={() => setSectionNumber(sectionNumber - 1)}
        className="flex items-center justify-center w-14 h-14 rounded-full add-button "
        onClick={handleOpen}
      >
        <AddIcon sx={{}} />
      </button>
      <LessonModal
        //handleOpen={handleOpen}
        handleClose={handleClose}
        open={open}
        addLesson={addLesson}
      />
    </div>
  );
};

export default page;
