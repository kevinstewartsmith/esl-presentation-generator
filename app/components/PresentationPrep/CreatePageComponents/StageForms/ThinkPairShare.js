"use client";
import React, { useEffect, useContext } from "react";
import Think from "./ThinkPairShairForms/Think";
import { ThinkPairShareContext } from "@app/contexts/ThinkPairShareContext";

const ThinkPairShare = ({ getSectionsLength, section }) => {
  const { fetchThinkPhaseDataFromDB } = useContext(ThinkPairShareContext);
  const sections = [
    <Think />,
    <div>ThinkPairShare 2</div>,
    <div>ThinkPairShare 3</div>,
  ];

  useEffect(() => {
    const sectionsLength = sections.length;
    console.log("sectionsLength");

    console.log("Think - Pair - Share Length" + sectionsLength);

    getSectionsLength(sectionsLength);

    //fetchThinkPhaseDataFromDB();
  }, []);

  //return <div>ThinkPairShare Component</div>;
  return <div>{sections[section]}</div>;
};

export default ThinkPairShare;
