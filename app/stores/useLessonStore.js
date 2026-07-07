"use client";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useLessonStore = create(
  subscribeWithSelector((set) => ({
    // Current logged-in user
    currentUserID: null,

    // Current lesson details
    currentLessonID: null,

    presentationIsShowing: false,

    lessonTitle: null,

    hidePresentation: () => set({ presentationIsShowing: false }),
    showPresentation: () => set({ presentationIsShowing: true }),

    setCurrentUserID: (id) => set({ currentUserID: id }),
    setCurrentLessonID: (id) => set({ currentLessonID: id }),
    updateLessonTitle: (title) => set({ lessonTitle: title }),

    clearLessonContext: () =>
      set({
        lessonTitle: null,
        currentLessonID: null,
        presentationIsShowing: false,
      }),
  })),
);
