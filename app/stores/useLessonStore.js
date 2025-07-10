import { create } from "zustand";

export const useLessonStore = create((set) => ({
  //Current logged in user
  currentUserID: null,

  //Current lesson details
  currentLessonID: null,

  presentationIsShowing: false,
  hidePresentation: () => set({ presentationIsShowing: false }),
  showPresentation: () => set({ presentationIsShowing: true }),

  setCurrentUserID: (id) => set({ currentUserID: id }),
  setCurrentLessonID: (id) => set({ currentLessonID: id }),

  //   warmup: {},
  //   updateWarmup: (data) => set((state) => ({ warmup: { ...state.warmup, ...data } })),
}));
