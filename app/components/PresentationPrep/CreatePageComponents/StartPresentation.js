import React, { useContext } from "react";
import Link from "next/link";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { updateCacheWithNewRows } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";

const StartPresentation = () => {
  //const { included, updateShowPresentation } = useContext(PresentationContext);
  const { presentationIsShowing, showPresentation } = useContext(
    GlobalVariablesContext
  );
  const handleClick = () => {
    //window.open("presentation", "_blank");
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
