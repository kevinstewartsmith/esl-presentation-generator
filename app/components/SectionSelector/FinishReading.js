import React from "react";
import { useLessonStore } from "@app/stores/useLessonStore";

const FinishReading = () => {
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

export default FinishReading;
