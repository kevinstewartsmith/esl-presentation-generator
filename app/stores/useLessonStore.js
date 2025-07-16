"use client";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useLessonStore = create(
  subscribeWithSelector((set, get) => ({
    // Current logged-in user
    currentUserID: null,

    // Current lesson details
    currentLessonID: null,

    presentationIsShowing: false,
    hidePresentation: () => set({ presentationIsShowing: false }),
    showPresentation: () => set({ presentationIsShowing: true }),

    setCurrentUserID: (id) => set({ currentUserID: id }),
    setCurrentLessonID: (id) => set({ currentLessonID: id }),

    thinkPhase: [],

    updateThinkPhase: (newPhase) => {
      console.log("🧠 Updating thinkPhase - Old ref:", get().thinkPhase);
      set({ thinkPhase: [...newPhase] });
      console.log("✅ New ref:", get().thinkPhase);
    },

    setHydratedThinkPhase: (data) => {
      set({
        thinkPhase: data,
        hasHydratedThinkPhase: true,
      });
    },

    clearThinkPhase: () => set({ thinkPhase: [] }),
  }))
);
