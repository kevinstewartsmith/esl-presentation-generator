"use client";
// useVocabStore.js
// Vocabulary's OWN source store (sibling of useReadingStore). Holds:
//   - vocabInputs:          the book reference { book, unit, page, exercise }
//   - imagePathsByCategory: screenshot preview paths — the SHARED AddTextBook
//                           component reads/writes these (same shape as reading).
//   - vocabQuestions / vocabAnswers:
//                           the STRUCTURED exercise that extract-textbook (Gemini
//                           vision) returns for the questions / answers screenshot,
//                           stored as a JSON string (same pattern as listening's
//                           audioQuestions). Shape of the questions payload:
//                           { instructions, questions:[{number,text,type,options,answer}],
//                             targetVocab:[...] }.
//   - screenshotWords:      the target-vocab list (seeded from the questions'
//                           targetVocab, teacher-editable); feeds Hot Seat.
// All persist to the Vocabulary section doc via the generic post-stage-text route.
//   FIELD_MAP needs: VocabInputs->vocabInputs, ImagePaths->imagePathsByCategory
//   (shared), VocabQuestions->vocabQuestions, VocabAnswers->vocabAnswers,
//   VocabScreenshotWords->screenshotWords.

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";
import { vocabularyStage } from "@app/utils/SectionIDs";

const initialState = {
  vocabInputs: {}, // { book, unit, page, exercise }
  imagePathsByCategory: {}, // { vocabQuestions: path, vocabAnswers: path }
  vocabQuestions: "", // JSON string of the parsed questions exercise
  vocabAnswers: "", // JSON string of the parsed answer key
  screenshotWords: [], // target vocab, teacher-editable
  justHydratedVocabInputs: false,
  justHydratedImagePaths: false,
  justHydratedVocabQuestions: false,
  justHydratedVocabAnswers: false,
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

    // Screenshot preview paths — the shared AddTextBook reads/writes these.
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

    // Structured exercise from extract-textbook (JSON strings).
    setVocabQuestions: (str) =>
      set({ vocabQuestions: str ?? "", justHydratedVocabQuestions: false }),
    setHydratedVocabQuestions: (str) =>
      set({ vocabQuestions: str ?? "", justHydratedVocabQuestions: true }),
    setVocabAnswers: (str) =>
      set({ vocabAnswers: str ?? "", justHydratedVocabAnswers: false }),
    setHydratedVocabAnswers: (str) =>
      set({ vocabAnswers: str ?? "", justHydratedVocabAnswers: true }),

    // Target vocabulary — seeded from the exercise, edited by the teacher.
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
const saveVocabQuestions = makeSaver("VocabQuestions");
const saveVocabAnswers = makeSaver("VocabAnswers");
const saveScreenshotWords = makeSaver("VocabScreenshotWords");

useVocabStore.subscribe(
  (s) => s.vocabInputs,
  (v) => {
    if (useVocabStore.getState().justHydratedVocabInputs) return;
    if (!v || Object.keys(v).length === 0) return;
    saveVocabInputs(v);
  },
);
useVocabStore.subscribe(
  (s) => s.imagePathsByCategory,
  (v) => {
    if (useVocabStore.getState().justHydratedImagePaths) return;
    if (!v || Object.keys(v).length === 0) return;
    saveImagePaths(v);
  },
);
useVocabStore.subscribe(
  (s) => s.vocabQuestions,
  (v) => {
    if (useVocabStore.getState().justHydratedVocabQuestions) return;
    if (!v) return;
    saveVocabQuestions(v);
  },
);
useVocabStore.subscribe(
  (s) => s.vocabAnswers,
  (v) => {
    if (useVocabStore.getState().justHydratedVocabAnswers) return;
    if (!v) return;
    saveVocabAnswers(v);
  },
);
useVocabStore.subscribe(
  (s) => s.screenshotWords,
  (v) => {
    if (useVocabStore.getState().justHydratedScreenshotWords) return;
    if (!Array.isArray(v) || v.length === 0) return;
    saveScreenshotWords(v);
  },
);
