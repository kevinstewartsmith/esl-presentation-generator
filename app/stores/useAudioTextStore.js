import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { debounce } from "@app/utils/debounce";
import { useLessonStore } from "@app/stores/useLessonStore";

const STAGE_ID = "Listening for Gist and Detail";

export const useAudioTextStore = create(
  subscribeWithSelector((set) => ({
    selectedAudioFileName: "",
    justHydrated: false,
    s2tTranscript: "",
    wordTimeArray: [],
    justHydratedTranscript: false,
    ocrTranscript: "",
    justHydratedOcr: false,
    audioQuestions: [],
    audioAnswers: [],
    justHydratedQA: false,
    comprehensionItems: [],
    justHydratedComprehension: false,

    updateComprehensionItems: (items) =>
      set({
        comprehensionItems: items ?? [],
        justHydratedComprehension: false,
      }),
    setHydratedComprehensionItems: (items) =>
      set({ comprehensionItems: items ?? [], justHydratedComprehension: true }),

    updateAudioQuestions: (q) =>
      set({ audioQuestions: q ?? [], justHydratedQA: false }),
    updateAudioAnswers: (a) =>
      set({ audioAnswers: a ?? [], justHydratedQA: false }),

    setHydratedAudioQuestions: (q) =>
      set({ audioQuestions: q ?? [], justHydratedQA: true }),
    setHydratedAudioAnswers: (a) =>
      set({ audioAnswers: a ?? [], justHydratedQA: true }),

    updateOcrTranscript: (text) =>
      set({ ocrTranscript: text ?? "", justHydratedOcr: false }),
    setHydratedOcrTranscript: (text) =>
      set({ ocrTranscript: text ?? "", justHydratedOcr: true }),

    updateSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: false }),

    setHydratedSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: true }),

    updateS2tTranscript: (text) =>
      set({ s2tTranscript: text ?? "", justHydratedTranscript: false }),
    updateWordTimeArray: (arr) =>
      set({ wordTimeArray: arr ?? [], justHydratedTranscript: false }),

    setHydratedS2tTranscript: (text) =>
      set({ s2tTranscript: text ?? "", justHydratedTranscript: true }),
    setHydratedWordTimeArray: (arr) =>
      set({ wordTimeArray: arr ?? [], justHydratedTranscript: true }),
  })),
);

const saveSelectedAudioFileName = debounce(async (fileName) => {
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
        textType: "AudioFileName",
        data: fileName,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}, 1500);

const saveS2tTranscript = debounce(async (text) => {
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
        textType: "S2tTranscript",
        data: text,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}, 1500);

const saveWordTimeArray = debounce(async (arr) => {
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
        textType: "WordTimeArray",
        data: arr,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}, 1500);

const saveOcrTranscript = debounce(async (text) => {
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
        textType: "OcrTranscript",
        data: text,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}, 1500);

const saveAudioQuestions = debounce(async (q) => {
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
        textType: "AudioQuestions",
        data: q,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}, 1500);

const saveAudioAnswers = debounce(async (a) => {
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
        textType: "AudioAnswers",
        data: a,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}, 1500);

const saveComprehensionItems = debounce(async (items) => {
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
        textType: "ComprehensionItems",
        data: items,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}, 1500);

useAudioTextStore.subscribe(
  (state) => state.comprehensionItems,
  (items) => {
    if (useAudioTextStore.getState().justHydratedComprehension) return;
    if (!items || items.length === 0) return;
    saveComprehensionItems(items);
  },
);

useAudioTextStore.subscribe(
  (s) => s.audioQuestions,
  (q) => {
    if (useAudioTextStore.getState().justHydratedQA) return;
    if (!q || q.length === 0) return;
    saveAudioQuestions(q);
  },
);

useAudioTextStore.subscribe(
  (s) => s.audioAnswers,
  (a) => {
    if (useAudioTextStore.getState().justHydratedQA) return;
    if (!a || a.length === 0) return;
    saveAudioAnswers(a);
  },
);

useAudioTextStore.subscribe(
  (state) => state.ocrTranscript,
  (text) => {
    if (useAudioTextStore.getState().justHydratedOcr) return;
    if (!text) return;
    saveOcrTranscript(text);
  },
);

useAudioTextStore.subscribe(
  (state) => state.selectedAudioFileName,
  (fileName) => {
    if (useAudioTextStore.getState().justHydrated) return;
    if (!fileName) return;
    saveSelectedAudioFileName(fileName);
  },
);

useAudioTextStore.subscribe(
  (s) => s.s2tTranscript,
  (text) => {
    if (useAudioTextStore.getState().justHydratedTranscript) return;
    if (!text) return;
    saveS2tTranscript(text);
  },
);

useAudioTextStore.subscribe(
  (s) => s.wordTimeArray,
  (arr) => {
    if (useAudioTextStore.getState().justHydratedTranscript) return;
    if (!arr || arr.length === 0) return;
    saveWordTimeArray(arr);
  },
);
