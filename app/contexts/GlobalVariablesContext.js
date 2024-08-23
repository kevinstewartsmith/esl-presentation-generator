"use client";
// audioContext.js
import { createContext, useEffect, useState } from "react";

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
  const [pathname, setPathname] = useState(null);
  function updateLessonTitle(title) {
    setLessonTitle(title);
  }
  function updatePathname(path) {
    setPathname(path);
    console.log("Pathname: ", path);
  }

  useEffect(() => {
    const isAllowedPath = pathname
      ? pathname.startsWith(`/${loggedInUser}/lessons/`) ||
        pathname.startsWith(`/${loggedInUser}/create/`)
      : false;
    console.log("isAllowedPath: ", isAllowedPath);

    if (!isAllowedPath) {
      setLessonTitle(null);
    }
  }, [pathname]);

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
        updatePathname,
      }}
    >
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export { GlobalVariablesContext, GlobalVariablesContextProvider };
