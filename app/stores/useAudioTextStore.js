import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { debounce } from "@app/utils/debounce";
import { useLessonStore } from "@app/stores/useLessonStore";
import { normalizeComprehensionItems } from "@app/utils/normalizeComprehensionItems";

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
  audioBucketContents: [],
  slideOrder: [],
  gistOptions: [], // [{ question, answer }, ...]
  selectedGist: null, // the chosen { question, answer }
  inputTexts: null, // the teacher's input texts (title, page, book, exercise, etc.)
  detailConfig: null, // detail stage presentation settings (modes + per-question)
  detailRatings: null, // { [index]: { level, reason } } CEFR difficulty per question

  justHydrated: false,
  justHydratedTranscript: false,
  justHydratedOcr: false,
  justHydratedQA: false,
  justHydratedComprehension: false,
  justHydratedImagePaths: false,
  justHydratedSlideOrder: false,
  justHydratedGist: false,
  justHydratedInputTexts: false,
  justHydratedDetailConfig: false,
  justHydratedDetailRatings: false,
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
      set({
        comprehensionItems: normalizeComprehensionItems(items),
        justHydratedComprehension: true,
      }),

    // slideOrder (the StageComposer arrangement)
    updateSlideOrder: (order) =>
      set({ slideOrder: order ?? [], justHydratedSlideOrder: false }),

    setHydratedSlideOrder: (order) =>
      set({ slideOrder: order ?? [], justHydratedSlideOrder: true }),

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

    updateAudioBucketContents: (contents) =>
      set({ audioBucketContents: contents ?? [] }),

    // gistOptions + selectedGist (share justHydratedGist)
    updateGistOptions: (options) =>
      set({ gistOptions: options ?? [], justHydratedGist: false }),
    updateSelectedGist: (gist) =>
      set({ selectedGist: gist ?? null, justHydratedGist: false }),

    setHydratedGist: (options, selected) =>
      set({
        gistOptions: options ?? [],
        selectedGist: selected ?? null,
        justHydratedGist: true,
      }),

    updateInputTextForKey: (key, value) =>
      set((state) => ({
        inputTexts: { ...(state.inputTexts ?? {}), [key]: value },
        justHydratedInputTexts: false,
      })),

    setHydratedInputTexts: (obj) =>
      set({ inputTexts: obj ?? {}, justHydratedInputTexts: true }),

    updateDetailMode: (key, value) =>
      set((state) => ({
        detailConfig: { ...(state.detailConfig ?? {}), [key]: value },
        justHydratedDetailConfig: false,
      })),

    updateDetailPerQuestion: (index, field, value) =>
      set((state) => {
        const cfg = state.detailConfig ?? {};
        const perQuestion = { ...(cfg.perQuestion ?? {}) };
        perQuestion[index] = { ...(perQuestion[index] ?? {}), [field]: value };
        return {
          detailConfig: { ...cfg, perQuestion },
          justHydratedDetailConfig: false,
        };
      }),

    setHydratedDetailConfig: (obj) =>
      set({ detailConfig: obj ?? {}, justHydratedDetailConfig: true }),

    // Replace the whole ratings map (used after a batch rate call).
    setDetailRatings: (map) =>
      set({ detailRatings: map ?? {}, justHydratedDetailRatings: false }),
    // Clear one question's rating (e.g. when its text was edited -> stale).
    clearDetailRating: (index) =>
      set((state) => {
        const next = { ...(state.detailRatings ?? {}) };
        delete next[index];
        return { detailRatings: next, justHydratedDetailRatings: false };
      }),
    setHydratedDetailRatings: (obj) =>
      set({ detailRatings: obj ?? {}, justHydratedDetailRatings: true }),
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
  {
    field: "slideOrder",
    flag: "justHydratedSlideOrder",
    textType: "SlideOrder",
    isEmpty: isEmptyArray,
  },
  {
    field: "gistOptions",
    flag: "justHydratedGist",
    textType: "GistOptions",
    isEmpty: isEmptyArray,
  },
  {
    field: "selectedGist",
    flag: "justHydratedGist",
    textType: "SelectedGist",
    isEmpty: (v) => v == null,
  },
  {
    field: "inputTexts",
    flag: "justHydratedInputTexts",
    textType: "InputTexts",
    isEmpty: (v) => v == null || Object.keys(v).length === 0,
  },
  {
    field: "detailConfig",
    flag: "justHydratedDetailConfig",
    textType: "DetailConfig",
    isEmpty: (v) => v == null || Object.keys(v).length === 0,
  },
  {
    field: "detailRatings",
    flag: "justHydratedDetailRatings",
    textType: "DetailRatings",
    isEmpty: (v) => v == null || Object.keys(v).length === 0,
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
