"use client";
// audioContext.js
import { createContext, useState } from "react";

const GlobalVariablesContext = createContext();

const GlobalVariablesContextProvider = ({ children }) => {
  const [presentationIsShowing, setPresentationIsShowing] = useState(false);

  function hidePresentation() {
    setPresentationIsShowing(false);
  }

  function showPresentation() {
    setPresentationIsShowing(true);
  }

  return (
    <GlobalVariablesContext.Provider
      value={{
        presentationIsShowing,
        hidePresentation,
        showPresentation,
      }}
    >
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export { GlobalVariablesContext, GlobalVariablesContextProvider };
