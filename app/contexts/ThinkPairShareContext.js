"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const ThinkPairShareContext = createContext();

const ThinkPairShareProvider = ({ children }) => {
  const [thinkPhase, setThinkPhase] = useState({});
  const [pairPhase, setPairPhase] = useState({});
  const [sharePhase, setSharePhase] = useState({});
  const [userID, setUserID] = useState("kevinstewartsmith");
  const [lessonID, setLessonID] = useState("");
  const stageID = "Think - Pair - Share";
  const encodedStageID = encodeURIComponent(stageID);

  //Adds lessonID to the URL
  function updateThinkPairShareLessonID(id) {
    //console.log("Update Lesson ID in Think-Pair-Share Context: " + id);
    setLessonID(id);
  }

  const updateThinkPhase = (newThink) => {
    //console.log("NEW THINK PHASE: " + JSON.stringify(newThink));
    // Check if newThink is an object
    if (typeof newThink !== "object" || newThink === null) {
      console.error("Invalid input: newThink must be an object");
    }

    setThinkPhase((prev) => ({ ...prev, ...newThink }));
  };

  const updatePairPhase = (newPair) => {
    setPairPhase((prev) => ({ ...prev, ...newPair }));
  };

  const updateSharePhase = (newShare) => {
    setSharePhase((prev) => ({ ...prev, ...newShare }));
  };

  useEffect(() => {
    //console.log("Think Phase updated:", thinkPhase);

    //console.log("Pair Phase updated:", pairPhase);
    //console.log("Share Phase updated:", sharePhase);

    //costumize this to your needs
    async function postThinkPairShareData() {
      //console.log("Posting Think-Pair-Share data...");
      //console.log(thinkPhase);

      const stringifiedThinkPhase = JSON.stringify(thinkPhase);

      try {
        const response = await fetch(
          `/api/firestore/think-pair-share/post-think-pair-share?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${stringifiedThinkPhase}&phase=think`,
          { method: "POST" }
        );
        const data = await response.json();
        //console.log("RESPONSE FROM POSTING TEXTBOOK DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postThinkPairShareData();
  }, [thinkPhase]);

  //////////////////////////////////////////////////////
  ////Start: Fetch Think Phase Data from Firestore//////
  //////////////////////////////////////////////////////
  async function fetchThinkPhaseDataFromDB() {
    const stage = "Think - Pair - Share"; // Use the stage ID directly
    const encodedStageID = encodeURIComponent(stage);
    //console.log("Getting Think Data (think - pair - share) from Firestore");
    try {
      const response = await fetch(
        `/api/firestore/think-pair-share/get-think-pair-share?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      //console.log("Think Phase DATA from Firestore:", data.ThinkPhase);
      //updateThinkPhase(data.ThinkPhase);

      const arrayData = Object.values(data.ThinkPhase);
      //console.log("Array Data:", arrayData);
      setSentenceStems(arrayData);
      updateThinkPhase(arrayData);
      //setThinkPhase
    } catch (error) {
      console.error(error);
    }
  }
  ////////////////////////////////////////////////
  ///End: Fetch Think Phase Data from Firestore///
  ////////////////////////////////////////////////

  return (
    <ThinkPairShareContext.Provider
      value={{
        thinkPhase,
        pairPhase,
        sharePhase,
        updateThinkPhase,
        updatePairPhase,
        updateSharePhase,
        updateThinkPairShareLessonID,
        fetchThinkPhaseDataFromDB,
      }}
    >
      {children}
    </ThinkPairShareContext.Provider>
  );
};

export { ThinkPairShareContext, ThinkPairShareProvider };
