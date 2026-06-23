import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";

const STAGE_ID = "Reading For Gist and Detail";

const initialReadingState = {
  textbook: null,
  questions: null,
  answers: null,
  inputTexts: null,

  justHydratedTexts: false,
  justHydratedInputTexts: false,
  hasAttemptedReadingHydration: false,
};

export const useReadingStore = create(
  subscribeWithSelector((set) => ({
    ...initialReadingState,

    resetReadingStore: () => set({ ...initialReadingState }),

    setHasAttemptedReadingHydration: (value) =>
      set({ hasAttemptedReadingHydration: value }),

    // textbook
    updateTextbook: (data) =>
      set({ textbook: data ?? null, justHydratedTexts: false }),
    setHydratedTextbook: (data) =>
      set({ textbook: data ?? null, justHydratedTexts: true }),

    // textbook transcript append (functional update — preserves the object, appends to textEdit)
    updateTextbookTranscript: (newData) =>
      set((state) => ({
        textbook: {
          ...state.textbook,
          textEdit: [...(state.textbook?.textEdit || []), newData],
        },
        justHydratedTexts: false,
      })),

    // questions
    updateQuestions: (data) =>
      set({ questions: data ?? null, justHydratedTexts: false }),
    setHydratedQuestions: (data) =>
      set({ questions: data ?? null, justHydratedTexts: true }),

    // answers
    updateAnswers: (data) =>
      set({ answers: data ?? null, justHydratedTexts: false }),
    setHydratedAnswers: (data) =>
      set({ answers: data ?? null, justHydratedTexts: true }),

    // inputTexts (dynamic per-key object: title, page, book, exercise, ...)
    updateInputTextForKey: (key, value) =>
      set((state) => ({
        inputTexts: { ...state.inputTexts, [key]: value },
        justHydratedInputTexts: false,
      })),
    setHydratedInputTexts: (obj) =>
      set({ inputTexts: obj ?? {}, justHydratedInputTexts: true }),
  })),
);

// ---- Persistence (reuses post-stage-text, same as Audio) ----

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

const FIELD_SUBSCRIPTIONS = [
  {
    field: "textbook",
    flag: "justHydratedTexts",
    textType: "BookText",
    isEmpty: isEmptyText,
  },
  {
    field: "questions",
    flag: "justHydratedTexts",
    textType: "QuestionText",
    isEmpty: isEmptyText,
  },
  {
    field: "answers",
    flag: "justHydratedTexts",
    textType: "AnswerText",
    isEmpty: isEmptyText,
  },
  {
    field: "inputTexts",
    flag: "justHydratedInputTexts",
    textType: "InputTexts",
    isEmpty: isEmptyObject,
  },
];

FIELD_SUBSCRIPTIONS.forEach(({ field, flag, textType, isEmpty }) => {
  const saver = makeFieldSaver(textType);
  useReadingStore.subscribe(
    (state) => state[field],
    (value) => {
      if (useReadingStore.getState()[flag]) return;
      if (isEmpty(value)) return;
      saver(value);
    },
  );
});
