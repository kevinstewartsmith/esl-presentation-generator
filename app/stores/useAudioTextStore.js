import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { debounce } from "@app/utils/debounce";
import { useLessonStore } from "@app/stores/useLessonStore";

const STAGE_ID = "Listening for Gist and Detail";

export const useAudioTextStore = create(
  subscribeWithSelector((set) => ({
    selectedAudioFileName: "",
    justHydrated: false,

    updateSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: false }),

    setHydratedSelectedAudioFileName: (fileName) =>
      set({ selectedAudioFileName: fileName ?? "", justHydrated: true }),
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

useAudioTextStore.subscribe(
  (state) => state.selectedAudioFileName,
  (fileName) => {
    if (useAudioTextStore.getState().justHydrated) return;
    if (!fileName) return;
    saveSelectedAudioFileName(fileName);
  },
);
