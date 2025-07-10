"use client";
import React, { useState, useEffect, useContext, use } from "react";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import { DashboardContext } from "@app/contexts/DashboardContext";
import { v4 as uuidv4 } from "uuid";
import { usePathname } from "next/navigation";
import { Grid } from "@mui/material";
import LessonCard from "@app/components/DashboardComponents/LessonCard";
import AddIcon from "@mui/icons-material/Add";
import LessonModal from "@app/components/DashboardComponents/lessonModal";
import { DashboardContextProvider } from "@app/contexts/DashboardContext";
import { useLessonStore } from "@app/stores/useLessonStore";

const PageComponent = ({ params }) => {
  const { loadLessons, deleteLessonFromDB, addNewLesson } =
    useContext(DashboardContext);
  const { updatePathname } = useContext(GlobalVariablesContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [lessons, setLessons] = useState([]);
  //const resolvedParams = use(params);
  //const userID = resolvedParams.userID;
  const userID = params.userID;
  //update userid in lesson store
  const { setCurrentUserID } = useLessonStore();
  //setCurrentUserID(params.userID);

  useEffect(() => {
    setCurrentUserID(userID);
  }, [userID, setCurrentUserID]);

  const pathname = usePathname();

  useEffect(() => {
    updatePathname(pathname);

    async function fetchAllLessons() {
      try {
        const response = await loadLessons(userID, "getAllLessons");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllLessons();
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
        const data = await response;
        console.log(JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }
    dbAddLesson();
  };

  function deleteLesson(lessonID) {
    if (confirm("Are you sure you want to delete this lesson?")) {
      const newLessons = lessons.filter((lesson) => lesson.id !== lessonID);
      setLessons(newLessons);

      //Delete lesson from database
      async function dbDeleteLeeson() {
        try {
          const response = await deleteLessonFromDB(userID, lessonID);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response;
          //console.log("Lessons data:", data[0].title);
        } catch (error) {
          console.error(error);
        }
      }
      dbDeleteLeeson();
    } else {
      console.log("User clicked Cancel");
    }
  }

  return (
    <div style={{ marginLeft: 40, marginRight: 40 }}>
      <h1>{userID}</h1>
      <Grid container spacing={0}>
        {lessons.map((lesson, index) => (
          <Grid item xs={3} padding={2} key={index}>
            <LessonCard
              key={index}
              deleteLesson={deleteLesson}
              lesson={lesson}
              userID={userID}
              onClick={() => console.log(lesson.id)}
            />
          </Grid>
        ))}
      </Grid>
      <button
        className="flex items-center justify-center w-14 h-14 rounded-full add-button "
        onClick={handleOpen}
      >
        <AddIcon sx={{}} />
      </button>
      <LessonModal
        handleClose={handleClose}
        open={open}
        addLesson={addLesson}
      />
    </div>
  );
};

const page = (props) => (
  <DashboardContextProvider>
    <PageComponent {...props} />
  </DashboardContextProvider>
);

export default page;
