"use client";
// useVocabStore.js
// Vocabulary's OWN source store (sibling of useReadingStore / useThinkPairShareStore).
// Holds the skill-SPECIFIC source material for a Vocabulary lesson. The shared
// STAGE machinery (slideOrder, stageActivities) still lives in useAudioTextStore,
// now section-keyed — this store is only for vocab's own content.
//
// Persistence: its own debounced saver, always keyed to the Vocabulary section
// (vocab source only ever belongs to the vocab section), POSTing through the same
// generic post-stage-text route. Needs FIELD_MAP["VocabInputs"] = "vocabInputs".

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";
import { vocabularyStage } from "@app/utils/SectionIDs";

const initialState = {
  vocabInputs: {}, // { book, unit, page, exercise }
  justHydratedVocabInputs: false,
};

export const useVocabStore = create(
  subscribeWithSelector((set) => ({
    ...initialState,

    resetVocabStore: () => set({ ...initialState }),

    updateVocabInputs: (patch) =>
      set((s) => ({
        vocabInputs: { ...(s.vocabInputs ?? {}), ...patch },
        justHydratedVocabInputs: false,
      })),

    setHydratedVocabInputs: (obj) =>
      set({ vocabInputs: obj ?? {}, justHydratedVocabInputs: true }),
  })),
);

// ---- Persistence ----
const saveVocabInputs = debounce(async (data) => {
  const { currentUserID, currentLessonID } = useLessonStore.getState();
  if (!currentUserID || !currentLessonID) return;
  try {
    await fetch("/api/firestore/post-stage-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: currentUserID,
        lessonID: currentLessonID,
        stageID: vocabularyStage,
        textType: "VocabInputs",
        data,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}, 1500);

useVocabStore.subscribe(
  (state) => state.vocabInputs,
  (value) => {
    if (useVocabStore.getState().justHydratedVocabInputs) return;
    if (!value || Object.keys(value).length === 0) return;
    saveVocabInputs(value);
  },
);
