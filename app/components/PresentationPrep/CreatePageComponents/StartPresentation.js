import React, { useContext } from "react";
import { useLessonStore } from "@app/stores/useLessonStore";

const StartPresentation = () => {
  const showPresentation = useLessonStore((s) => s.showPresentation);
  const handleClick = () => {
    showPresentation(true);
  };

  return (
    <>
      <button style={{ color: "black" }} onClick={handleClick}>
        Start Presentation
      </button>
    </>
  );
};

export default StartPresentation;
