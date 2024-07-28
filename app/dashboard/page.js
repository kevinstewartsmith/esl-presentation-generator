"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import LessonCard from "@app/components/DashboardComponents/LessonCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import LessonModal from "../components/DashboardComponents/lessonModal";
import { v4 as uuidv4 } from "uuid";

const page = () => {
  const [num, setNum] = useState(4);

  // function handleAdd() {
  //   setNum(num + 1);
  // }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const lessons = localStorage.getItem("lessons");
    if (lessons) {
      setLessons(JSON.parse(lessons));
    }
  }, []);

  const addLesson = (title) => {
    console.log(uuidv4());

    const lessonId = uuidv4();
    const newLesson = {
      id: lessonId,
      title: title,
      description: "This is a new lesson",
      sections: [],
    };

    setLessons([...lessons, newLesson]);
    console.log(lessons);
    const lessonString = JSON.stringify([...lessons, newLesson]);

    if (typeof window !== "undefined") {
      localStorage.setItem("lessons", lessonString);
    }
    console.log("add lesson");
    console.log("Lesson Length: ", lessons.length);
    handleClose();
  };

  function deleteLesson(lessonId) {
    console.log("delete lesson");
    console.log(lessonId);

    const newLessons = lessons.filter((lesson) => lesson.id !== lessonId);
    setLessons(newLessons);
    const lessonString = JSON.stringify(newLessons);
    if (typeof window !== "undefined") {
      localStorage.setItem("lessons", lessonString);
    }
  }

  return (
    <div style={{ marginLeft: 40, marginRight: 40 }}>
      <Grid container spacing={0}>
        {lessons.map((lesson, index) => (
          <Grid item xs={3} padding={2} key={index}>
            <LessonCard
              key={index}
              deleteLesson={deleteLesson}
              lesson={lesson}
              onClick={() => console.log("clicked")}
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
