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
    console.log("Update Lesson ID in Think-Pair-Share Context: " + id);
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
    console.log("Think Phase updated:", thinkPhase);

    console.log("Pair Phase updated:", pairPhase);
    console.log("Share Phase updated:", sharePhase);

    //costumize this to your needs
    async function postThinkPairShareData() {
      console.log("Posting Think-Pair-Share data...");
      console.log(thinkPhase);

      const stringifiedThinkPhase = JSON.stringify(thinkPhase);

      try {
        const response = await fetch(
          `/api/firestore/think-pair-share/post-think-pair-share?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${stringifiedThinkPhase}`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING TEXTBOOK DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postThinkPairShareData();
  }, [thinkPhase]);

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
      }}
    >
      {children}
    </ThinkPairShareContext.Provider>
  );
};

export { ThinkPairShareContext, ThinkPairShareProvider };
