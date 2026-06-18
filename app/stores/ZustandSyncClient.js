"use client";

import { useEffect } from "react";
import { useLessonStore } from "@app/stores/useLessonStore";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import { postToApiSectionData } from "@app/utils/PostToApiUtil";
//import { useLessonStore } from "@app/stores/useLessonStore";
//if (typeof window !== "undefined") window.useLessonStore = useLessonStore;

export default function ZustandSyncClient() {
  console.log("🚀 ZustandSyncClient FILE loaded (should only run on client)");
  useEffect(() => {
    console.log("🧩 ZustandSyncClient initialized");
  }, []);

  useEffect(() => {
    console.log("✅ ZustandSyncClient mounted");

    const state = useLessonStore.getState();
    console.log("🧪 Zustand current state:", state);

    const unsubUserID = useLessonStore.subscribe(
      (state) => state.currentUserID,
      (id) => {
        console.log("✅ Updated currentUserID", id);
      },
    );
    console.log("📡 Subscribed to currentUserID");
    const unsubLessonID = useLessonStore.subscribe(
      (state) => state.currentLessonID,
      (id) => {
        console.log("✅ currentLessonID changed:", id);
      },
    );
    console.log("📡 Subscribed to currentLessonID");

    let debounceTimer;

    const unsubAudioQuestions = useLessonStore.subscribe(
      (state) => state.audioQuestions,
      (questions, prevQuestions) => {
        console.log("⁉️Audio Questions changed:", questions);
        // Only POST if data actually changed
        if (JSON.stringify(questions) === JSON.stringify(prevQuestions)) {
          console.log("📜 No changes detected in audioQuestions");
          return; // No real change, skip autosave
        }
        console.log("❓Audio Questions updated:", questions);
        const { currentUserID, currentLessonID, hasHydratedAudioQuestions } =
          useLessonStore.getState();

        // //🧯 Skip autosave until we've hydrated from Firestore
        if (!hasHydratedAudioQuestions) {
          console.log(
            "⏭ Skipping autosave: hydration not complete - audioQuestions",
          );
          return;
        }

        const keyName = "audioQuestions";
        postToApiSectionData(
          currentUserID,
          currentLessonID,
          listeningForGistandDetailStage,
          keyName,
          questions,
        );
      },
    );
    console.log("📡 Subscribed to audioQuestions changes");
    const unsubAudioAnswers = useLessonStore.subscribe(
      (state) => state.audioAnswers,
      (answers, prevAnswers) => {
        console.log("⁉️Audio Answers changed:", answers);

        // Only POST if data actually changed
        if (JSON.stringify(answers) === JSON.stringify(prevAnswers)) {
          console.log("📜 No changes detected in audioAnswers");
          return; // No real change, skip autosave
        }
        console.log("🗣️Audio Answers updated:", answers);
        const { currentUserID, currentLessonID, hasHydratedAudioAnswers } =
          useLessonStore.getState();

        // //🧯 Skip autosave until we've hydrated from Firestore
        if (!hasHydratedAudioAnswers) {
          console.log(
            "⏭ Skipping autosave: hydration not complete - audioAnswers",
          );
          return;
        }

        const keyName = "audioAnswers";
        postToApiSectionData(
          currentUserID,
          currentLessonID,
          listeningForGistandDetailStage,
          keyName,
          answers,
        );
      },
    );
    console.log("📡 Subscribed to audioAnswers changes");

    const unsubCompleteListeningStageData = useLessonStore.subscribe(
      (state) => state.completeListeningStageData,
      (data, prevData) => {
        console.log("⁉️Complete Listening Stage Data changed:", data);

        // Only POST if data actually changed
        if (JSON.stringify(data) === JSON.stringify(prevData)) {
          console.log(
            "📜 No changes detected in Complete Listening Stage Data",
          );
          return; // No real change, skip autosave
        }
        const {
          currentUserID,
          currentLessonID,
          hasHydratedCompleteListeningStageData,
        } = useLessonStore.getState();

        //🧯 Skip autosave until we've hydrated from Firestore
        if (!hasHydratedCompleteListeningStageData) {
          console.log(
            "⏭ Skipping autosave: hydration not complete - completeListeningStageData",
          );
          return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (!currentUserID || !currentLessonID) {
            console.log("⛔ Missing values for autosave");
            return;
          }

          const encodedStageID = encodeURIComponent(
            "Listening for Gist and Detail",
          );

          try {
            const res = await fetch(
              "/api/firestore/complete-listening-stage-data/post-complete-listening-stage-data",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userID: currentUserID,
                  lessonID: currentLessonID,
                  stageID: listeningForGistandDetailStage,
                  data: data,
                }),
              },
            );
            const result = await res.json();
            console.log("✅ Autosaved:", result);
            console.log("📜 Complete Listening Stage Data updated:", data);
          } catch (err) {
            console.error("❌ Autosave failed", err);
          }
        }, 5000);
      },
    );

    const unsubAudioFileName = useLessonStore.subscribe(
      (state) => state.audioFileName,
      (fileName) => {
        console.log("🔈 Audio File Name updated:", fileName);
      },
    );
    console.log("📡 Subscribed to AudioFileName changes");

    return () => {
      clearTimeout(debounceTimer);
      unsubUserID();
      unsubLessonID();
      //unsubThinkPhase();
      //unsubTest();
      //unsubAll();

      unsubAudioQuestions();
      unsubAudioAnswers();
      unsubCompleteListeningStageData();
      unsubAudioFileName();

      console.log("📴 All subscriptions unsubscribed");
    };
  }, []);

  return null;
}
