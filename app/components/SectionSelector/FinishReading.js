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
      {/* <button style={{ color: "black" }} onClick={handleClick}>
        Open New Tab
      </button> */}
      {/* <Link href="https://www.example.com" passHref>
        <a target="_blank" rel="noopener noreferrer">
          Open in New Tab
        </a>
      </Link> */}
      <button onClick={handleClick}>Start Presentation</button>
    </>
  );
};

export default FinishReading;