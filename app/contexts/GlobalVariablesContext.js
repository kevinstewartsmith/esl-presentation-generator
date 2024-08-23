"use client";
// audioContext.js
import { createContext, useState } from "react";

const GlobalVariablesContext = createContext();

const GlobalVariablesContextProvider = ({ children }) => {
  const [presentationIsShowing, setPresentationIsShowing] = useState(false);
  const loggedInUser = "kevinstewartsmith";

  function hidePresentation() {
    setPresentationIsShowing(false);
  }

  function showPresentation() {
    setPresentationIsShowing(true);
  }
  //////////////////////////////////////////
  // START: Lesson title state/////////////
  ////////////////////////////////////////
  const [lessonTitle, setLessonTitle] = useState(null);
  function updateLessonTitle(title) {
    setLessonTitle(title);
  }

  return (
    <GlobalVariablesContext.Provider
      value={{
        presentationIsShowing,
        hidePresentation,
        showPresentation,
        loggedInUser,

        // Lesson title state
        lessonTitle,
        updateLessonTitle,
      }}
    >
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export { GlobalVariablesContext, GlobalVariablesContextProvider };
