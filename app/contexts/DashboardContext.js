"use client";
import { createContext, useState } from "react";

const DashboardContext = createContext();

const DashboardContextProvider = ({ children }) => {
  const [userID, setUserID] = useState("");

  async function loadLessons(userID, method, lessonID) {
    if (method === "getAllLessons") {
      const data = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&method=${method}`
      );
      return data;
    } else if (method === "getOneLesson") {
      const data = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&method=${method}&lessonID=${lessonID}`
      );
      return data;
    }
    console.log(data);
    return data;
  }

  async function addNewLesson(userID, title) {
    try {
      const data = await fetch(
        `/api/firestore/post-lessons?userID=${userID}&lessonTitle=${title}`,
        {
          method: "POST",
          // We convert the React state to JSON and send it as the POST body
          body: JSON.stringify({
            lessonTitle: "lesson title",
          }),
          // headers: {"Content-Type": "application/json", 'Accept': 'application/json'}
        }
      );

      return data.json();
      //return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLessonFromDB(userID, lessonID) {
    try {
      const data = await fetch(
        `/api/firestore/delete-lesson?userID=${userID}&lessonID=${lessonID}`,
        {
          method: "DELETE",
          // We convert the React state to JSON and send it as the POST body
          body: JSON.stringify({
            lessonID: lessonID,
            userID: userID,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(data);
      return data.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        //lessons,
        loadLessons,
        addNewLesson,
        deleteLessonFromDB,
        userID,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
export { DashboardContext, DashboardContextProvider };
