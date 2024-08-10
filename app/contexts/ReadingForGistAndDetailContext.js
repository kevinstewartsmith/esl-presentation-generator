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

  //Discussion forms state
  const [discussionForms, setDiscussionForms] = useState({});

  const addDiscussionLine = (id) => {
    setDiscussionForms((prev) => {
      const form = prev[id] || {
        numberOfDiscussionLines: 0,
        discussionTexts: [],
      };
      return {
        ...prev,
        [id]: {
          ...form,
          numberOfDiscussionLines: form.numberOfDiscussionLines + 1,
          discussionTexts: [...form.discussionTexts, ""],
        },
      };
    });
  };

  async function getAllDiscussionDataFromFirestore(userID, lessonID, stageID) {
    console.log("Getting all discussion data from Firestore");
    try {
      const response = await fetch(
        `/api/firestore/get-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Discussion DATA from Firestore:", data);
      //const parsedData = JSON.parse(data);
      console.log("Parsed Discussion Data Type:", typeof data);
      setDiscussionForms(data);
    } catch (error) {
      console.error(error);
    }
  }

  function updateDiscussionText(id, index, text) {
    console.log("updateDiscussionText NEW CONTEXT");
    setDiscussionForms((prev) => {
      const form = prev[id] || { discussionTexts: [] };
      const newTexts = [...form.discussionTexts];
      newTexts[index] = text;
      return {
        ...prev,
        [id]: {
          ...form,
          discussionTexts: newTexts,
        },
      };
    });
  }

  async function updateDiscussionTextsDataInFirestore(newData, lessonID) {
    console.log("updateDiscussionTextsDataInFirestore NEW CONTEXT");
    console.log("Updating Firestore with new data:", newData);
    console.log("Lesson ID in Input post method:", lessonID);

    const data = JSON.stringify(newData);
    try {
      const response = await fetch(
        `/api/firestore/post-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage&data=${data}`,
        {
          method: "POST",
        }
      );
      console.log("Response from Firestore:", response);
      return response;
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
  //End of discussion form functions

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
  const [discussionsLoaded, setDiscussionsLoaded] = useState(false);
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
      setDiscussionsLoaded(true);
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

  const debouncedSaveDiscussionTexts = useMemo(
    () =>
      debounce((newData, lessonID) => {
        console.log("Calling Firestore READING CONTEXT:", newData);
        console.log("Lesson ID in debounced save:", lessonID);
        updateDiscussionTextsDataInFirestore(newData, lessonID);
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

  useEffect(() => {
    console.log("Discussion forms changed:", discussionForms);
    if (Object.keys(discussionForms).length > 0 && discussionsLoaded) {
      console.log("Data changed: " + discussionForms);
      debouncedSaveDiscussionTexts(discussionForms, lessonID);
      console.log("Inside of posting triggered");
    } else {
      console.log("No data to post");
    }
  }, [discussionForms]);

  return (
    <ReadingForGistAndDetailContext.Provider
      value={{
        updateInputTextsReading,
        inputTexts,
        updateLessonID,
        lessonID,
        fetchDataFromFirestore,
        getAllInputDataFromFirestore,
        discussionForms,
        addDiscussionLine,
        updateDiscussionText,
        getAllDiscussionDataFromFirestore,
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
