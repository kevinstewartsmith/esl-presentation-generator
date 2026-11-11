"use client";
// VocabularySection.js
// The Vocabulary SKILL component (sibling of ListeningForGistAndDetail), and the
// first skill to run on the GENERALIZED shell: its step pages are
//   [ Source → Arrange → Configure ]
// where Arrange (StageComposer) and Configure (ConfigureStageDetails) are the
// SHARED leaf components reused from the listening folder. Hot Seat and the
// warm-up/lead-in activities work here with no extra wiring.
//
// It sets currentSectionId = "Vocabulary" so every save lands in the Vocabulary
// section doc, and hydrates the shared stage machinery (slideOrder,
// stageActivities, …) + vocab's own source (vocabInputs) from that doc.

import React, { useEffect } from "react";

import StageComposer from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/StageComposer";
import ConfigureStageDetails from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/ConfigureStageDetails";
import VocabSourcePage from "./VocabSourcePage";

import { vocabularyStage } from "@app/utils/SectionIDs";
import { getCompleteVocabStageDataFromDB } from "@app/utils/GetStageData";
import { useLessonStore } from "@app/stores/useLessonStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useVocabStore } from "@app/stores/useVocabStore";

const VocabularySection = ({ getSectionsLength, section }) => {
  const userID = useLessonStore((s) => s.currentUserID);
  const lessonID = useLessonStore((s) => s.currentLessonID);

  // Shared stage store
  const resetAudioStore = useAudioTextStore((s) => s.resetAudioStore);
  const setCurrentSectionId = useAudioTextStore((s) => s.setCurrentSectionId);
  const setHydratedSlideOrder = useAudioTextStore(
    (s) => s.setHydratedSlideOrder,
  );
  const setHydratedStageActivities = useAudioTextStore(
    (s) => s.setHydratedStageActivities,
  );
  const setHydratedDetailConfig = useAudioTextStore(
    (s) => s.setHydratedDetailConfig,
  );
  const setHydratedScrambleConfig = useAudioTextStore(
    (s) => s.setHydratedScrambleConfig,
  );

  // Vocab's own source store
  const resetVocabStore = useVocabStore((s) => s.resetVocabStore);
  const setHydratedVocabInputs = useVocabStore((s) => s.setHydratedVocabInputs);
  const setHydratedImagePaths = useVocabStore((s) => s.setHydratedImagePaths);
  const setHydratedScreenshotWords = useVocabStore(
    (s) => s.setHydratedScreenshotWords,
  );
  const setHydratedVocabQuestions = useVocabStore(
    (s) => s.setHydratedVocabQuestions,
  );
  const setHydratedVocabAnswers = useVocabStore(
    (s) => s.setHydratedVocabAnswers,
  );

  const sections = [
    <VocabSourcePage key="source" />,
    <StageComposer key="arrange" />,
    <ConfigureStageDetails key="configure" />,
  ];

  useEffect(() => {
    getSectionsLength(sections.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchVocabData = async () => {
      resetAudioStore();
      resetVocabStore();
      setCurrentSectionId(vocabularyStage);

      const data = await getCompleteVocabStageDataFromDB(userID, lessonID);
      // Shared stage machinery (keyed to this section)
      setHydratedSlideOrder(data?.slideOrder || []);
      setHydratedStageActivities(data?.stageActivities || {});
      setHydratedDetailConfig(data?.detailConfig || {});
      setHydratedScrambleConfig(data?.scrambleConfig || {});
      // Vocab's own source
      setHydratedVocabInputs(data?.vocabInputs || {});
      setHydratedImagePaths(data?.imagePathsByCategory || {});
      setHydratedScreenshotWords(data?.screenshotWords || []);
      setHydratedVocabQuestions(data?.vocabQuestions || "");
      setHydratedVocabAnswers(data?.vocabAnswers || "");
    };
    fetchVocabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, lessonID]);

  return <div>{sections[section]}</div>;
};

export default VocabularySection;
