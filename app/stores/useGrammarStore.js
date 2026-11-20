import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";

// Grammar skill store (Running Dictation first). Mirrors useReadingStore's
// persistence pattern. Single section, so STAGE_ID is fixed.
const STAGE_ID = "Grammar: Running Dictation";

const initialGrammarState = {
  // Repeatable grammar exercises — each { questions, answers } holds the
  // extracted text (stringified JSON from extract-textbook) for that exercise's
  // question screenshot and answer screenshot. A book page usually has 3–5.
  grammarExercises: [],
  // Lesson aims / target language (editable list of strings).
  aims: [],
  // Running-dictation sentences: [{ sentence, target }] (target = bolded item).
  dictationSentences: [],
  // inputTexts: { lessonName, topic, level, grammarPoint, ... }
  inputTexts: null,
  // Per-category screenshot paths (AddTextBook image persistence).
  imagePathsByCategory: {},

  justHydratedExercises: false,
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

    // grammarExercises (array of { questions, answers })
    setGrammarExercises: (ex) =>
      set({ grammarExercises: Array.isArray(ex) ? ex : [], justHydratedExercises: false }),
    setHydratedGrammarExercises: (ex) =>
      set({ grammarExercises: Array.isArray(ex) ? ex : [], justHydratedExercises: true }),
    updateGrammarExerciseField: (index, field, value) =>
      set((state) => {
        const next = [...state.grammarExercises];
        while (next.length <= index) next.push({ questions: null, answers: null });
        next[index] = { ...next[index], [field]: value };
        return { grammarExercises: next, justHydratedExercises: false };
      }),
    addGrammarExercise: (seed = {}) =>
      set((state) => ({
        grammarExercises: [...state.grammarExercises, { questions: null, answers: null, ...seed }],
        justHydratedExercises: false,
      })),
    removeGrammarExercise: (index) =>
      set((state) => ({
        grammarExercises: state.grammarExercises.filter((_, i) => i !== index),
        justHydratedExercises: false,
      })),

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
      set({ dictationSentences: Array.isArray(s) ? s : [], justHydratedSentences: false }),
    setHydratedDictationSentences: (s) =>
      set({ dictationSentences: Array.isArray(s) ? s : [], justHydratedSentences: true }),
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

    // inputTexts
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
        imagePathsByCategory: { ...state.imagePathsByCategory, [category]: path ?? "" },
        justHydratedImagePaths: false,
      })),
    setHydratedImagePaths: (obj) =>
      set({ imagePathsByCategory: obj ?? {}, justHydratedImagePaths: true }),
  })),
);

// Readable combined text from the exercises (for aims + sentence generation).
function fieldToText(v) {
  if (!v) return "";
  try {
    const o = JSON.parse(v);
    if (o && typeof o === "object") {
      if (Array.isArray(o.questions))
        return o.questions.map((q) => `${q.number ?? ""} ${q.text ?? ""}`.trim()).join("\n");
      if (Array.isArray(o.answers))
        return o.answers.map((a) => `${a.number ?? ""} ${a.answer ?? ""}`.trim()).join("\n");
      if (typeof o.text === "string") return o.text;
      return JSON.stringify(o);
    }
  } catch {}
  return String(v);
}

export function grammarExercisesToText(exercises) {
  return (exercises || [])
    .map((ex, i) => {
      const q = fieldToText(ex?.questions);
      const a = fieldToText(ex?.answers);
      const parts = [];
      if (q) parts.push("Questions:\n" + q);
      if (a) parts.push("Answers:\n" + a);
      return parts.length ? `Exercise ${i + 1}\n` + parts.join("\n") : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

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

const isEmptyObject = (v) => !v || Object.keys(v).length === 0;
const isEmptyArray = (v) => !v || v.length === 0;

const FIELD_SUBSCRIPTIONS = [
  { field: "grammarExercises", flag: "justHydratedExercises", textType: "GrammarExercises", isEmpty: isEmptyArray },
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
