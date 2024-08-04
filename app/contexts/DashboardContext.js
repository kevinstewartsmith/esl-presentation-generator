"use client";
import { createContext, useState, useEffect } from "react";

const DashboardContext = createContext();

const DashboardContextProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);

  async function loadLessons(userID, method) {
    const data = await fetch(
      `/api/firestore/get-lessons?userId=${userID}&method=${method}`
    );
    console.log(data);
    return data;
  }

  async function addNewLesson(title) {
    try {
      const response = await fetch("/api/firestore/post-lessons", {
        method: "POST",
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify({
          lessonTitle: "lesson title",
        }),
        // headers: {"Content-Type": "application/json", 'Accept': 'application/json'}
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashboardContext.Provider value={{ lessons, loadLessons, addNewLesson }}>
      {children}
    </DashboardContext.Provider>
  );
};
export { DashboardContext, DashboardContextProvider };
