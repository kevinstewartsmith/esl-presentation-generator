"use client";
import { AudioFile } from "@node_modules/@mui/icons-material";
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
    audioQuestionsImageFilePath: "",
    updateAudioQuestionsImageFilePath: (path) =>
      set({ audioQuestionsImageFilePath: path }),

    audioAnswersImageFilePath: "",
    updateAudioAnswersImageFilePath: (path) =>
      set({ audioAnswersImageFilePath: path }),

    audioTranscriptImageFilePath: "",
    updateAudioTranscriptImageFilePath: (path) =>
      set({ audioTranscriptImageFilePath: path }),

    audioTranscript: "",
    updateAudioTranscript: (text) => set({ audioTranscript: text }),

    audioQuestions: [],
    updateAudioQuestions: (questions) => set({ audioQuestions: questions }),

    audioAnswers: [],
    updateAudioAnswers: (answers) => set({ audioAnswers: answers }),

    s2TAudioTranscript: "",
    updateS2TAudioTranscript: (text) => set({ s2TAudioTranscript: text }),

    AudioFileName: "",
    updateAudioFileName: (fileName) => set({ AudioFileName: fileName }),

    wordTimeArray: [],
    updateWordTimeArray: (array) => set({ wordTimeArray: array }),

    audioClipQuestionData: [],
    updateAudioClipQuestionData: (data) => set({ audioClipQuestionData: data }),

    updateAudioClipQuestionDataByIndex: (index, key, value) =>
      set((state) => {
        const updated = [...state.audioClipQuestionData];
        if (!updated[index]) return {}; // safeguard

        updated[index] = {
          ...updated[index],
          [key]: value,
        };

        return { audioClipQuestionData: updated };
      }),

    completeListeningStageData: {
      questionsAndAnswers: [],
      transcript: "",
      wordArray: [],
      audioFileName: "",
    },
    updateCompleteListeningStageData: (data) =>
      set({ completeListeningStageData: data }),

    audioSnippetFilenameArray: [],
    updateAudioSnippetFilenameArray: (array) =>
      set({ audioSnippetFilenameArray: array }),

    //Update audio file name in completeListeningStageData
    // updateAudioFileName: (fileName) =>
    //   set((state) => ({
    //     completeListeningStageData: {
    //       ...state.completeListeningStageData,
    //       audioFileName: fileName,
    //     },
    //   })),

    // Audio Stage - End
  }))
);
