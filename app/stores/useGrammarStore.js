import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";

// Grammar skill store (Running Dictation first). Mirrors useReadingStore's
// persistence pattern. Single section, so STAGE_ID is fixed.
const STAGE_ID = "Grammar: Running Dictation";

const initialGrammarState = {
  // Raw extracted exercise text (source material from the uploaded screenshot).
  grammarContent: null,
  // Lesson aims / target language (editable list of strings) — from the generic
  // aims generator, also appropriate to paste into a lesson plan.
  aims: [],
  // Running-dictation sentences: [{ sentence, target }] (target = bolded item).
  dictationSentences: [],
  // inputTexts: { lessonName, topic, level, grammarPoint, ... }
  inputTexts: null,
  // Per-category screenshot paths (AddTextBook image persistence).
  imagePathsByCategory: {},

  justHydratedContent: false,
  justHydratedAims: false,
  justHydratedSentences: false,
  justHydratedInputTexts: false,
  justHydratedImagePaths: false,
  hasAttemptedGrammarHydration: false,
};

export const useGrammarStore = create(
  subscribeWithSelector((set) => ({
    ...initialGrammarState,

    resetGrammarStore: () => set({ ...initialGrammarState }),
    setHasAttemptedGrammarHydration: (v) =>
      set({ hasAttemptedGrammarHydration: v }),

    // grammarContent
    updateGrammarContent: (data) =>
      set({ grammarContent: data ?? null, justHydratedContent: false }),
    setHydratedGrammarContent: (data) =>
      set({ grammarContent: data ?? null, justHydratedContent: true }),

    // aims (array of strings)
    setAims: (aims) =>
      set({ aims: Array.isArray(aims) ? aims : [], justHydratedAims: false }),
    setHydratedAims: (aims) =>
      set({ aims: Array.isArray(aims) ? aims : [], justHydratedAims: true }),
    updateAim: (index, value) =>
      set((state) => {
        const next = [...state.aims];
        next[index] = value;
        return { aims: next, justHydratedAims: false };
      }),
    addAim: () =>
      set((state) => ({ aims: [...state.aims, ""], justHydratedAims: false })),
    removeAim: (index) =>
      set((state) => ({
        aims: state.aims.filter((_, i) => i !== index),
        justHydratedAims: false,
      })),

    // dictationSentences ([{ sentence, target }])
    setDictationSentences: (s) =>
      set({
        dictationSentences: Array.isArray(s) ? s : [],
        justHydratedSentences: false,
      }),
    setHydratedDictationSentences: (s) =>
      set({
        dictationSentences: Array.isArray(s) ? s : [],
        justHydratedSentences: true,
      }),
    updateDictationSentence: (index, patch) =>
      set((state) => {
        const next = [...state.dictationSentences];
        if (!next[index]) return {};
        next[index] = { ...next[index], ...patch };
        return { dictationSentences: next, justHydratedSentences: false };
      }),
    removeDictationSentence: (index) =>
      set((state) => ({
        dictationSentences: state.dictationSentences.filter((_, i) => i !== index),
        justHydratedSentences: false,
      })),

    // inputTexts (dynamic per-key object)
    updateInputTextForKey: (key, value) =>
      set((state) => ({
        inputTexts: { ...state.inputTexts, [key]: value },
        justHydratedInputTexts: false,
      })),
    setHydratedInputTexts: (obj) =>
      set({ inputTexts: obj ?? {}, justHydratedInputTexts: true }),

    // imagePathsByCategory
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

// ---- Persistence (reuses post-stage-text, same pattern as Reading) ----
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

const isEmptyText = (v) => v == null;
const isEmptyObject = (v) => !v || Object.keys(v).length === 0;
const isEmptyArray = (v) => !v || v.length === 0;

const FIELD_SUBSCRIPTIONS = [
  { field: "grammarContent", flag: "justHydratedContent", textType: "GrammarContent", isEmpty: isEmptyText },
  { field: "aims", flag: "justHydratedAims", textType: "GrammarAims", isEmpty: isEmptyArray },
  { field: "dictationSentences", flag: "justHydratedSentences", textType: "DictationSentences", isEmpty: isEmptyArray },
  { field: "inputTexts", flag: "justHydratedInputTexts", textType: "InputTexts", isEmpty: isEmptyObject },
  { field: "imagePathsByCategory", flag: "justHydratedImagePaths", textType: "ImagePaths", isEmpty: isEmptyObject },
];

FIELD_SUBSCRIPTIONS.forEach(({ field, flag, textType, isEmpty }) => {
  const saver = makeFieldSaver(textType);
  useGrammarStore.subscribe(
    (state) => state[field],
    (value) => {
      if (useGrammarStore.getState()[flag]) return;
      if (isEmpty(value)) return;
      saver(value);
    },
  );
});
