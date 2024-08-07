import React from "react";
import dynamic from "next/dynamic";

const PresentationDisplay = dynamic(
  () => import("../components/PresentationDisplay"),
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <PresentationDisplay />
    </div>
  );
};

export default page;
