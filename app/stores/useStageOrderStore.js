"use client";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useLessonStore } from "@app/stores/useLessonStore";
import { debounce } from "@app/utils/debounce";

const initialState = {
  items: {}, // { root: [...included], container1: [...unincluded] }
  justHydratedItems: false,
};

export const useStageOrderStore = create(
  subscribeWithSelector((set) => ({
    ...initialState,

    resetStageOrderStore: () => set({ ...initialState }),

    // Handles BOTH forms, like React setState:
    //   updateItems(obj)            — direct replace (hydration, page fetch)
    //   updateItems(prev => next)   — functional update (drag logic in stage_sorter)
    updateItems: (updater) =>
      set((state) => ({
        items: typeof updater === "function" ? updater(state.items) : updater,
        justHydratedItems: false,
      })),

    setHydratedItems: (obj) =>
      set({ items: obj ?? {}, justHydratedItems: true }),
  })),
);

// ---- Persistence: debounced save to post-stages (old-style query-param route) ----
const saveStageOrder = debounce(async (items) => {
  const { currentUserID, currentLessonID } = useLessonStore.getState();
  if (!currentUserID || !currentLessonID) return;
  // SAFETY: never save empty/initial — mirrors the route's own empty-guard
  const root = items?.root ?? [];
  const container1 = items?.container1 ?? [];
  if (root.length === 0 && container1.length === 0) return;

  try {
    const stages = encodeURIComponent(JSON.stringify(items));
    await fetch(
      `/api/firestore/post-stages?userID=${currentUserID}&lessonID=${currentLessonID}&stages=${stages}`,
      { method: "POST", headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);
  }
}, 1500);

useStageOrderStore.subscribe(
  (state) => state.items,
  (items) => {
    if (useStageOrderStore.getState().justHydratedItems) return;
    saveStageOrder(items);
  },
);
