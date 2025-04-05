"use client";
// audioContext.js
import { createContext, useState, useEffect, useMemo, use } from "react";
import { useDebouncedUpdate } from "@app/hooks/useDebounceUpdate";
import { debounce } from "@app/utils/debounce";
const PresentationContext = createContext();

const PresentationContextProvider = ({ children }) => {
  const [showPresentation, setShowPresentation] = useState(false);
  /////////START: Lesson Stages State
  const [stages, setStages] = useState({});
  const [userID, setUserID] = useState("kevinstewartsmith");
  /////////////////////////////////////////////
  ///////START: Lesson ID State////////////////
  /////////////////////////////////////////////
  const [lessonID, setLessonID] = useState("");

  function updateLessonIDPresentationContext(newLessonID) {
    setLessonID(newLessonID);
  }
  /////////////////////////////////////////////
  ////////END: Lesson ID State////////////////
  ///////////////////////////////////////////
  const defaultStages = {
    root: ["Class Rules", "Effort and Attitude Score", "Warm-Up: Speaking"],
    container1: [
      "Warm-Up: Board Race",
      "Reading For Gist and Detail",
      "Listening for Gist and Detail",
      "Advantages - Disadvantages",
      "Brainstorming",
      "Speaking: Debate",
      "Writing: Essay",
      "Speaking: Role Play",
      "Speaking: Presentation",
      "Speaking: Survey",
      "Think - Pair - Share",
      "Vocabulary",
    ],
    // container2: ["7", "8", "9"],
    // container3: [],
  };
  const [includedStages, setIncludedStages] = useState();
  const [items, setItems] = useState({});
  function updateItems(newItems) {
    console.log("PRES CONTEXT SET ITEMs OBJECT:", newItems);

    setItems(newItems);
  }

  function updateStages(newItems) {
    console.log("PRES CONTEEXT SET STAGES");
    console.log(newItems);

    const rootArray = newItems.root.map((obj) => Object.values(obj)[0]);
    const container1Array = newItems.container1.map(
      (obj) => Object.values(obj)[0]
    );
    const obj = {
      root: rootArray,
      container1: container1Array,
    };
    console.log("PRES CONTEXT SET STAGES OBJECT:", obj);
    setStages(obj);
  }

  //End Lesson Stages State

  const debouncedSave = useMemo(
    () =>
      debounce((newData) => {
        console.log("Calling Firestore:", newData);
        //updateDataInFirestore(newData);
      }, 5000),
    []
  );

  return (
    <PresentationContext.Provider
      value={{
        stages,
        updateStages,
        updateLessonIDPresentationContext,
        lessonID,
        items,
        updateItems,

        //includedStages,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export { PresentationContext, PresentationContextProvider };
