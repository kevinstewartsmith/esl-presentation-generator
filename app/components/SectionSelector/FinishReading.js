import React, { useContext } from "react";
import Link from "next/link";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { updateCacheWithNewRows } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";

const FinishReading = () => {
  const { included, updateShowPresentation } = useContext(PresentationContext);
  const handleClick = () => {
    //window.open("presentation", "_blank");
    updateShowPresentation(true);
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
