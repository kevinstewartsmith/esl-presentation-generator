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

    audioQuestionsImageFilePath: "",
    updateAudioQuestionsImageFilePath: (path) =>
      set({ audioQuestionsImageFilePath: path }),

    audioAnswersImageFilePath: "",
    updateAudioAnswersImageFilePath: (path) =>
      set({ audioAnswersImageFilePath: path }),

    audioTranscriptImageFilePath: "",
    updateAudioTranscriptImageFilePath: (path) =>
      set({ audioTranscriptImageFilePath: path }),

    s2TAudioTranscript: "",
    updateS2TAudioTranscript: (text) => set({ s2TAudioTranscript: text }),

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

    audioSnippetFilenameArray: [],
    updateAudioSnippetFilenameArray: (array) =>
      set({ audioSnippetFilenameArray: array }),

    audioBucketContents: [],
    updateAudioBucketContents: (contents) =>
      set({ audioBucketContents: contents }),

    // Audio Stage - End
  })),
);
