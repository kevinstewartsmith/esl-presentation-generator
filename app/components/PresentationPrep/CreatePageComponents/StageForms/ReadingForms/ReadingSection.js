"use client";
// ReadingSection.js
// The Reading SKILL on the GENERALIZED shell (sibling of VocabularySection).
// Replaces the obsolete ReadingForGistandDetailForm (SectionSelector /
// PreReadingVocabSlides / PreReadingGames / FinishReading pipeline). Its pages:
//   [ Source (ReadingContent) → Arrange (StageComposer) → Configure (ConfigureStageDetails) ]
//
// Sets currentSectionId = "Reading for Gist and Detail" so every save lands in
// the Reading section doc, and hydrates the shared stage machinery (slideOrder,
// stageActivities, …) + reading's own source (textbook, questions, answers,
// readingVocab, …) from that doc.

import React, { useEffect } from "react";

import StageComposer from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/StageComposer";
import ConfigureStageDetails from "@app/components/PresentationPrep/CreatePageComponents/StageForms/_shared/Setup/ConfigureStageDetails";
import ReadingContent from "@app/components/PresentationPrep/ReadingContent";
import ReadingReview from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ReadingForms/ReadingReview";

import { readingForGistandDetailStage } from "@app/utils/SectionIDs";
import { getCompleteReadingStageDataFromDB } from "@app/utils/GetStageData";
import { buildReadingItemsFromStrings } from "@app/components/FinalPresentationSections/readingDetailModel";
import { useLessonStore } from "@app/stores/useLessonStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const ReadingSection = ({ getSectionsLength, section }) => {
  const userID = useLessonStore((s) => s.currentUserID);
  const lessonID = useLessonStore((s) => s.currentLessonID);

  // Shared stage store (keyed to this section via currentSectionId)
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
  const setHydratedGist = useAudioTextStore((s) => s.setHydratedGist);

  // Reading's own source store
  const resetReadingStore = useReadingStore((s) => s.resetReadingStore);
  const setHydratedTextbook = useReadingStore((s) => s.setHydratedTextbook);
  const setHydratedQuestions = useReadingStore((s) => s.setHydratedQuestions);
  const setHydratedAnswers = useReadingStore((s) => s.setHydratedAnswers);
  const setHydratedReadingItems = useReadingStore((s) => s.setHydratedReadingItems);
  const setReadingItems = useReadingStore((s) => s.setReadingItems);
  const setHydratedInputTexts = useReadingStore((s) => s.setHydratedInputTexts);
  const setHydratedReadingVocab = useReadingStore(
    (s) => s.setHydratedReadingVocab,
  );
  const setHydratedImagePaths = useReadingStore((s) => s.setHydratedImagePaths);
  const setHydratedDiscussions = useReadingStore(
    (s) => s.setHydratedDiscussions,
  );
  const setHydratedIncluded = useReadingStore((s) => s.setHydratedIncluded);
  const setHasAttemptedReadingHydration = useReadingStore(
    (s) => s.setHasAttemptedReadingHydration,
  );

  const sections = [
    <ReadingContent key="source" stageID={readingForGistandDetailStage} />,
    <ReadingReview key="review" />,
    <StageComposer key="arrange" />,
    <ConfigureStageDetails key="configure" />,
  ];

  useEffect(() => {
    getSectionsLength(sections.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchReadingData = async () => {
      resetAudioStore();
      resetReadingStore();
      setCurrentSectionId(readingForGistandDetailStage);

      const data = await getCompleteReadingStageDataFromDB(userID, lessonID);
      // Shared stage machinery
      setHydratedSlideOrder(data?.slideOrder || []);
      setHydratedStageActivities(data?.stageActivities || {});
      setHydratedDetailConfig(data?.detailConfig || {});
      setHydratedScrambleConfig(data?.scrambleConfig || {});
      setHydratedGist(data?.gistOptions || [], data?.selectedGist || null);
      // Reading's own source
      setHydratedTextbook(data?.textbook || null);
      setHydratedQuestions(data?.questions || null);
      setHydratedAnswers(data?.answers || null);
      // Structured per-question items are the source of truth. Load them if
      // saved; otherwise migrate from the raw Q&A strings once (this build
      // persists, so next load has structured items). setReadingItems (not the
      // hydrated setter) so the migration write actually saves.
      if (Array.isArray(data?.readingItems) && data.readingItems.length) {
        setHydratedReadingItems(data.readingItems);
      } else {
        const built = buildReadingItemsFromStrings({
          questions: data?.questions || null,
          answers: data?.answers || null,
        });
        if (built.length) setReadingItems(built);
        else setHydratedReadingItems([]);
      }
      setHydratedInputTexts(data?.inputTexts || {});
      setHydratedReadingVocab(data?.readingVocab || []);
      setHydratedImagePaths(data?.imagePathsByCategory || {});
      setHydratedDiscussions(data?.discussionForms || data?.discussions || {});
      setHydratedIncluded(data?.included || {});
      setHasAttemptedReadingHydration(true);
    };
    fetchReadingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, lessonID]);

  return <div>{sections[section]}</div>;
};

export default ReadingSection;
