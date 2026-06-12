import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { debounce } from "@app/utils/debounce";
import { useLessonStore } from "@app/stores/useLessonStore";

const STAGE_ID = "Think - Pair - Share";

export const useThinkPairShareStore = create(
  subscribeWithSelector((set) => ({
    thinkPhase: [],
    justHydrated: false, // true right after a DB load, so autosave can skip it

    // user edit -> should save
    updateThinkPhase: (newPhase) =>
      set({ thinkPhase: [...newPhase], justHydrated: false }),

    // load from DB -> should NOT trigger a save
    setHydratedThinkPhase: (data) =>
      set({ thinkPhase: data ?? [], justHydrated: true }),

    clearThinkPhase: () => set({ thinkPhase: [], justHydrated: false }),
  })),
);

// --- Autosave: persist thinkPhase on user edits, debounced ---
const saveThinkPhase = debounce(async (thinkPhase) => {
  const { currentUserID, currentLessonID } = useLessonStore.getState();
  if (!currentUserID || !currentLessonID) return;
  try {
    await fetch(
      `/api/firestore/think-pair-share/post-think-pair-share?userID=${currentUserID}&lessonID=${currentLessonID}&stageID=${encodeURIComponent(
        STAGE_ID,
      )}&data=${JSON.stringify(thinkPhase)}&phase=think`,
      { method: "POST" },
    );
  } catch (error) {
    console.error(error);
  }
}, 1500);

useThinkPairShareStore.subscribe(
  (state) => state.thinkPhase,
  (thinkPhase) => {
    if (useThinkPairShareStore.getState().justHydrated) return; // skip loaded data
    if (!Array.isArray(thinkPhase) || thinkPhase.length === 0) return; // skip empty
    saveThinkPhase(thinkPhase);
  },
);
