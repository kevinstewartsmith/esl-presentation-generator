"use client";
import { createContext, useState, useEffect, useMemo } from "react";
import { debounce } from "@app/utils/debounce";

const ReadingForGistAndDetailContext = createContext();

const ReadingForGistAndDetailContextProvider = ({ children }) => {
  const [userID, setUserID] = useState("kevinstewartsmith");

  const [title, setTitle] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [text, setText] = useState("");
  const [inputTexts, setInputTexts] = useState({});
  const [lessonID, setLessonID] = useState("");
  const [newInput, setNewInput] = useState({});
  let counter = 0;

  function updateLessonID(id) {
    console.log("Update Lesson ID in RFGD Context: " + id);
    setLessonID(id);
  }

  function updateInputTextsReading(key, value) {
    console.log("Updating input texts in RFGD Context:", key, value);
    console.log("LEsson ID in update text input :", lessonID);
    setInputTexts({ ...inputTexts, [key]: value });
    setNewInput({ [key]: value });
    counter++;
    //setTextTitle(value);
  }

  async function getAllInputDataFromFirestore(userID, lessonID, stageID) {
    try {
      const response = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getAllInputs&stageID=${stageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Input Data from Firestore:", data);
      setInputTexts(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateInputDataInFirestore(newData, lessonID) {
    console.log("Updating Firestore with new data:", newData);
    console.log("Lesson ID in Input post method:", lessonID);
    console.log("User ID in Input post method:", userID);

    const id = "KKlHzoJ0AV4sWd4VISzA";
    const data = JSON.stringify(newData);
    try {
      const response = await fetch(
        `/api/firestore/post-lessons?userID=${userID}&lessonID=${lessonID}&method=postLessonInput&stageID=teststage&key=name&value=omg&data=${data}`,
        {
          method: "POST",
        }
      );
      console.log("Response from Firestore:", response);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
  async function fetchDataFromFirestore(userID, lessonID, stageID) {
    try {
      const response = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getOneLesson&stageID=${stageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Data from Firestore:", data);
      setInputTexts(data);
    } catch (error) {
      console.error(error);
    }
  }

  const debouncedSave = useMemo(
    () =>
      debounce((newData, lessonID) => {
        console.log("Calling Firestore READING CONTEXT:", newData);
        console.log("Lesson ID in debounced save:", lessonID);
        updateInputDataInFirestore(newData, lessonID);
      }, 5000),
    []
  );
  //   useEffect(() => {
  //     // Fetch data when the component mounts
  //     fetchDataFromFirestore(
  //       "kevinstewartsmith",
  //       "muVB5DSX1l0OLg2dokHL",
  //       "teststage"
  //     );
  //     console.log("Context mounts");
  //   }, []);

  useEffect(() => {
    console.log("POSTING USEEFFECT TRIGGERED");
    console.log(Object.keys(inputTexts).length);
    console.log("Lesson ID in useEffect:", lessonID);
    if (Object.keys(inputTexts).length > 0) {
      console.log("Data changed: " + inputTexts);
      debouncedSave(inputTexts, lessonID);
      console.log("Inside of posting triggered");
    } else {
      console.log("No data to post");
    }
  }, [inputTexts]);

  return (
    <ReadingForGistAndDetailContext.Provider
      value={{
        updateInputTextsReading,
        inputTexts,
        updateLessonID,
        lessonID,
        fetchDataFromFirestore,
        getAllInputDataFromFirestore,
      }}
    >
      {children}
    </ReadingForGistAndDetailContext.Provider>
  );
};

export {
  ReadingForGistAndDetailContext,
  ReadingForGistAndDetailContextProvider,
};
