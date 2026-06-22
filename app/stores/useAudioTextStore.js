import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { debounce } from "@app/utils/debounce";
import { useLessonStore } from "@app/stores/useLessonStore";

const STAGE_ID = "Listening for Gist and Detail";

const initialAudioState = {
  selectedAudioFileName: "",
  s2tTranscript: "",
  wordTimeArray: [],
  ocrTranscript: "",
  audioQuestions: [],
  audioAnswers: [],
  comprehensionItems: [],
  imagePathsByCategory: {},

  justHydrated: false,
  justHydratedTranscript: false,
  justHydratedOcr: false,
  justHydratedQA: false,
  justHydratedComprehension: false,
  justHydratedImagePaths: false,
  hasAttemptedAudioHydration: false,
};

export const useAudioTextStore = create(
  subscribeWithSelector((set) => ({
    ...initialAudioState,

    resetAudioStore: () => set({ ...initialAudioState }),

    setHasAttemptedAudioHydration: (value) =>
      set({ hasAttemptedAudioHydration: value }),

    // selectedAudioFileName
    updateSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: false }),
    setHydratedSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: true }),

    // s2tTranscript + wordTimeArray (share justHydratedTranscript)
    updateS2tTranscript: (text) =>
      set({ s2tTranscript: text ?? "", justHydratedTranscript: false }),
    setHydratedS2tTranscript: (text) =>
      set({ s2tTranscript: text ?? "", justHydratedTranscript: true }),
    updateWordTimeArray: (arr) =>
      set({ wordTimeArray: arr ?? [], justHydratedTranscript: false }),
    setHydratedWordTimeArray: (arr) =>
      set({ wordTimeArray: arr ?? [], justHydratedTranscript: true }),

    // ocrTranscript
    updateOcrTranscript: (text) =>
      set({ ocrTranscript: text ?? "", justHydratedOcr: false }),
    setHydratedOcrTranscript: (text) =>
      set({ ocrTranscript: text ?? "", justHydratedOcr: true }),

    // audioQuestions + audioAnswers (share justHydratedQA)
    updateAudioQuestions: (q) =>
      set({ audioQuestions: q ?? [], justHydratedQA: false }),
    setHydratedAudioQuestions: (q) =>
      set({ audioQuestions: q ?? [], justHydratedQA: true }),
    updateAudioAnswers: (a) =>
      set({ audioAnswers: a ?? [], justHydratedQA: false }),
    setHydratedAudioAnswers: (a) =>
      set({ audioAnswers: a ?? [], justHydratedQA: true }),

    // comprehensionItems
    updateComprehensionItems: (items) =>
      set({
        comprehensionItems: items ?? [],
        justHydratedComprehension: false,
      }),
    setHydratedComprehensionItems: (items) =>
      set({ comprehensionItems: items ?? [], justHydratedComprehension: true }),

    // imagePathsByCategory (per-category writes)
    updateImagePathForCategory: (category, path) =>
      set((state) => ({
        imagePathsByCategory: {
          ...state.imagePathsByCategory,
          [category]: path ?? "",
        },
        justHydratedImagePaths: false,
      })),
    setHydratedImagePaths: (obj) =>
      set({ imagePathsByCategory: obj ?? {}, justHydratedImagePaths: true }),
  })),
);

// ---- Persistence: one saver factory + one config table ----

function makeFieldSaver(textType) {
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
          stageID: STAGE_ID,
          textType,
          data,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, 1500);
}

const isEmptyString = (v) => !v;
const isEmptyArray = (v) => !v || v.length === 0;
const isEmptyObject = (v) => !v || Object.keys(v).length === 0;

const FIELD_SUBSCRIPTIONS = [
  {
    field: "selectedAudioFileName",
    flag: "justHydrated",
    textType: "AudioFileName",
    isEmpty: isEmptyString,
  },
  {
    field: "s2tTranscript",
    flag: "justHydratedTranscript",
    textType: "S2tTranscript",
    isEmpty: isEmptyString,
  },
  {
    field: "wordTimeArray",
    flag: "justHydratedTranscript",
    textType: "WordTimeArray",
    isEmpty: isEmptyArray,
  },
  {
    field: "ocrTranscript",
    flag: "justHydratedOcr",
    textType: "OcrTranscript",
    isEmpty: isEmptyString,
  },
  {
    field: "audioQuestions",
    flag: "justHydratedQA",
    textType: "AudioQuestions",
    isEmpty: isEmptyArray,
  },
  {
    field: "audioAnswers",
    flag: "justHydratedQA",
    textType: "AudioAnswers",
    isEmpty: isEmptyArray,
  },
  {
    field: "comprehensionItems",
    flag: "justHydratedComprehension",
    textType: "ComprehensionItems",
    isEmpty: isEmptyArray,
  },
  {
    field: "imagePathsByCategory",
    flag: "justHydratedImagePaths",
    textType: "ImagePaths",
    isEmpty: isEmptyObject,
  },
];

FIELD_SUBSCRIPTIONS.forEach(({ field, flag, textType, isEmpty }) => {
  const saver = makeFieldSaver(textType);
  useAudioTextStore.subscribe(
    (state) => state[field],
    (value) => {
      if (useAudioTextStore.getState()[flag]) return;
      if (isEmpty(value)) return;
      saver(value);
    },
  );
});
