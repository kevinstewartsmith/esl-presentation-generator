"use client";
// GrammarSection.js — the Grammar skill (Running Dictation) on the create page.
// Pages: [ Source (GrammarSource) -> Build (GrammarBuild) ]. (Arrange/Configure
// + presentation slides are a planned follow-up.) Resets + hydrates
// useGrammarStore from the Grammar section doc.

import React, { useEffect } from "react";
import GrammarSource from "./GrammarSource";
import GrammarBuild from "./GrammarBuild";
import { getCompleteGrammarStageDataFromDB } from "@app/utils/GetStageData";
import { useLessonStore } from "@app/stores/useLessonStore";
import { useGrammarStore } from "@app/stores/useGrammarStore";

const GrammarSection = ({ getSectionsLength, section }) => {
  const userID = useLessonStore((s) => s.currentUserID);
  const lessonID = useLessonStore((s) => s.currentLessonID);

  const resetGrammarStore = useGrammarStore((s) => s.resetGrammarStore);
  const setHydratedGrammarExercises = useGrammarStore((s) => s.setHydratedGrammarExercises);
  const setHydratedAims = useGrammarStore((s) => s.setHydratedAims);
  const setHydratedDictationSentences = useGrammarStore((s) => s.setHydratedDictationSentences);
  const setHydratedInputTexts = useGrammarStore((s) => s.setHydratedInputTexts);
  const setHydratedImagePaths = useGrammarStore((s) => s.setHydratedImagePaths);
  const setHasAttemptedGrammarHydration = useGrammarStore((s) => s.setHasAttemptedGrammarHydration);

  const sections = [
    <GrammarSource key="source" />,
    <GrammarBuild key="build" />,
  ];

  useEffect(() => {
    getSectionsLength(sections.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchGrammarData = async () => {
      resetGrammarStore();
      const data = await getCompleteGrammarStageDataFromDB(userID, lessonID);
      setHydratedGrammarExercises(data?.grammarExercises || []);
      setHydratedAims(data?.aims || []);
      setHydratedDictationSentences(data?.dictationSentences || []);
      setHydratedInputTexts(data?.inputTexts || {});
      setHydratedImagePaths(data?.imagePathsByCategory || {});
      setHasAttemptedGrammarHydration(true);
    };
    fetchGrammarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, lessonID]);

  return <div>{sections[section]}</div>;
};

export default GrammarSection;
