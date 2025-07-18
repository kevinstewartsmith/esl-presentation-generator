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

    // Think-Pair-Share Phase - Start
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
    // Think-Pair-Share Phase - End

    // Audio Stage - Start
    audioTranscript: "",
    updateAudioTranscript: (text) => set({ audioTranscript: text }),

    audioQuestions: [],
    updateAudioQuestions: (questions) => set({ audioQuestions: questions }),

    audioAnswers: [],
    updateAudioAnswers: (answers) => set({ audioAnswers: answers }),

    // Audio Stage - End
  }))
);
