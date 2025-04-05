"use client";
import React, { createContext, useContext, useState } from "react";

// Create the context
const ThinkPairShareContext = createContext();

const ThinkPairShareProvider = ({ children }) => {
  const [thinkPhase, setThinkPhase] = useState({});
  const [pairPhase, setPairPhase] = useState({});
  const [sharePhase, setSharePhase] = useState({});

  const updateThinkPhase = (newThink) => {
    console.log("NEW THINK PHASE: " + JSON.stringify(newThink));
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

  return (
    <ThinkPairShareContext.Provider
      value={{
        thinkPhase,
        pairPhase,
        sharePhase,
        updateThinkPhase,
        updatePairPhase,
        updateSharePhase,
      }}
    >
      {children}
    </ThinkPairShareContext.Provider>
  );
};

export { ThinkPairShareContext, ThinkPairShareProvider };
