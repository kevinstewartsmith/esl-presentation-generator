"use client";
// useVocabStore.js
// Vocabulary's OWN source store (sibling of useReadingStore). Holds:
//   - vocabInputs:         the book reference { book, unit, page, exercise }
//   - imagePathsByCategory:screenshot preview paths — the SHARED AddTextBook
//                          component reads/writes these (same shape as reading).
//   - screenshotWords:     vocabulary Gemini extracted from the screenshots,
//                          teacher-editable; feeds Hot Seat's vocab-screenshots.
// All persist to the Vocabulary section doc via the generic post-stage-text route.
//   FIELD_MAP needs: VocabInputs->vocabInputs, ImagePaths->imagePathsByCategory
//   (already present, shared), VocabScreenshotWords->screenshotWords.

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";
import { vocabularyStage } from "@app/utils/SectionIDs";

const initialState = {
  vocabInputs: {}, // { book, unit, page, exercise }
  imagePathsByCategory: {}, // { vocabQuestions: path, vocabAnswers: path }
  screenshotWords: [], // extracted vocab, teacher-editable
  justHydratedVocabInputs: false,
  justHydratedImagePaths: false,
  justHydratedScreenshotWords: false,
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

    // Screenshot preview paths — the shared AddTextBook reads/writes these,
    // identical to useReadingStore / useAudioTextStore.
    updateImagePathForCategory: (category, path) =>
      set((s) => ({
        imagePathsByCategory: {
          ...(s.imagePathsByCategory ?? {}),
          [category]: path ?? "",
        },
        justHydratedImagePaths: false,
      })),
    setHydratedImagePaths: (obj) =>
      set({ imagePathsByCategory: obj ?? {}, justHydratedImagePaths: true }),

    // Extracted vocabulary — set by the extract route, edited by the teacher.
    setScreenshotWords: (arr) =>
      set({
        screenshotWords: Array.isArray(arr) ? arr : [],
        justHydratedScreenshotWords: false,
      }),
    setHydratedScreenshotWords: (arr) =>
      set({
        screenshotWords: Array.isArray(arr) ? arr : [],
        justHydratedScreenshotWords: true,
      }),
  })),
);

// ---- Persistence: one debounced saver per field, all keyed to the Vocab section ----
function makeSaver(textType) {
  return debounce(async (data) => {
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
          textType,
          data,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, 1500);
}

const saveVocabInputs = makeSaver("VocabInputs");
const saveImagePaths = makeSaver("ImagePaths");
const saveScreenshotWords = makeSaver("VocabScreenshotWords");

useVocabStore.subscribe(
  (state) => state.vocabInputs,
  (value) => {
    if (useVocabStore.getState().justHydratedVocabInputs) return;
    if (!value || Object.keys(value).length === 0) return;
    saveVocabInputs(value);
  },
);

useVocabStore.subscribe(
  (state) => state.imagePathsByCategory,
  (value) => {
    if (useVocabStore.getState().justHydratedImagePaths) return;
    if (!value || Object.keys(value).length === 0) return;
    saveImagePaths(value);
  },
);

useVocabStore.subscribe(
  (state) => state.screenshotWords,
  (value) => {
    if (useVocabStore.getState().justHydratedScreenshotWords) return;
    if (!Array.isArray(value) || value.length === 0) return;
    saveScreenshotWords(value);
  },
);
