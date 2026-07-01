import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";

const STAGE_ID = "Reading for Gist and Detail";

const initialReadingState = {
  textbook: null,
  questions: null,
  answers: null,
  inputTexts: null,
  discussionForms: {},
  readingVocab: [],
  included: {},
  imagePathsByCategory: {},

  justHydratedTexts: false,
  justHydratedInputTexts: false,
  justHydratedDiscussions: false,
  justHydratedReadingVocab: false,
  justHydratedIncluded: false,
  justHydratedImagePaths: false,
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

    // discussionForms (nested: { [id]: { discussionTexts: [...] } })
    updateDiscussionText: (id, index, text) =>
      set((state) => {
        const form = state.discussionForms?.[id] || { discussionTexts: [] };
        const newTexts = [...form.discussionTexts];
        newTexts[index] = text;
        return {
          discussionForms: {
            ...state.discussionForms,
            [id]: { ...form, discussionTexts: newTexts },
          },
          justHydratedDiscussions: false,
        };
      }),
    setHydratedDiscussions: (obj) =>
      set({ discussionForms: obj ?? {}, justHydratedDiscussions: true }),

    addDiscussionLine: (id) =>
      set((state) => {
        const form = state.discussionForms?.[id] || {
          numberOfDiscussionLines: 0,
          discussionTexts: [],
        };
        return {
          discussionForms: {
            ...state.discussionForms,
            [id]: {
              ...form,
              numberOfDiscussionLines: form.numberOfDiscussionLines + 1,
              discussionTexts: [...form.discussionTexts, ""],
            },
          },
          justHydratedDiscussions: false,
        };
      }),

    // readingVocab: array of { word, definition, img_url, selected }
    // Words come from ChatGPT (Get Vocab). Images fetched lazily on first selection.
    setReadingVocab: (words) =>
      set({ readingVocab: words ?? [], justHydratedReadingVocab: false }),

    // Select a word. Pass imgUrl only on first selection (when the word has no image yet);
    // omit it if the word already has an img_url (no re-fetch needed).
    selectVocabWord: (index, imgUrl) =>
      set((state) => {
        const next = [...state.readingVocab];
        if (!next[index]) return {};
        next[index] = {
          ...next[index],
          selected: true,
          ...(imgUrl !== undefined ? { img_url: imgUrl } : {}),
        };
        return { readingVocab: next, justHydratedReadingVocab: false };
      }),

    // Deselect a word — flips selected only, deliberately KEEPS img_url (sticky image).
    deselectVocabWord: (index) =>
      set((state) => {
        const next = [...state.readingVocab];
        if (!next[index]) return {};
        next[index] = { ...next[index], selected: false };
        return { readingVocab: next, justHydratedReadingVocab: false };
      }),

    // Future "pick a different image" menu — overwrite one word's image.
    setVocabImageUrl: (index, url) =>
      set((state) => {
        const next = [...state.readingVocab];
        if (!next[index]) return {};
        next[index] = { ...next[index], img_url: url ?? "" };
        return { readingVocab: next, justHydratedReadingVocab: false };
      }),

    setHydratedReadingVocab: (words) =>
      set({ readingVocab: words ?? [], justHydratedReadingVocab: true }),

    // included: { [sectionId]: boolean } — which optional sections are toggled on
    toggleIncludedSection: (id) =>
      set((state) => ({
        included: { ...state.included, [id]: !state.included?.[id] },
        justHydratedIncluded: false,
      })),
    setHydratedIncluded: (obj) =>
      set({ included: obj ?? {}, justHydratedIncluded: true }),

    // imagePathsByCategory (per-category OCR screenshot paths — Reading textbook uploads)
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
const isEmptyArray = (v) => !v || v.length === 0;

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
  {
    field: "discussionForms",
    flag: "justHydratedDiscussions",
    textType: "Discussions",
    isEmpty: isEmptyObject,
  },
  {
    field: "readingVocab",
    flag: "justHydratedReadingVocab",
    textType: "ReadingVocab",
    isEmpty: isEmptyArray,
  },
  {
    field: "included",
    flag: "justHydratedIncluded",
    textType: "Included",
    isEmpty: isEmptyObject,
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
  useReadingStore.subscribe(
    (state) => state[field],
    (value) => {
      if (useReadingStore.getState()[flag]) return;
      if (isEmpty(value)) return;
      saver(value);
    },
  );
});
