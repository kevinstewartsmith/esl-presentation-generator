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
