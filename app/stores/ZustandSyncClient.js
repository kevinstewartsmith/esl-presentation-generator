"use client";

import { useEffect } from "react";
import { useLessonStore } from "@app/stores/UseLessonStore";

//import { useLessonStore } from "@app/stores/UseLessonStore";
//if (typeof window !== "undefined") window.useLessonStore = useLessonStore;

export default function ZustandSyncClient() {
  console.log("🚀 ZustandSyncClient FILE loaded (should only run on client)");
  useEffect(() => {
    console.log("🧩 ZustandSyncClient initialized");
  }, []);

  ////////////////////////////////////////
  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);
  const thinkPhase = useLessonStore((state) => state.thinkPhase);

  useEffect(() => {
    console.log(
      "React subscription useEFFECT - currentUserID changed:",
      currentUserID
    );
  }, [currentUserID]);

  useEffect(() => {
    console.log(
      "React subscription useEFFECT - currentLessonID changed:",
      currentLessonID
    );
  }, [currentLessonID]);

  useEffect(() => {
    console.log(
      "React subscription useEFFECT - thinkPhase changed:",
      thinkPhase
    );
  }, [thinkPhase]);

  ////////////////////////////////////////

  useEffect(() => {
    console.log("✅ ZustandSyncClient mounted");

    // let currentUserID = useLessonStore.getState().currentUserID;
    // let currentLessonID = useLessonStore.getState().currentLessonID;
    // let currentUserID = useLessonStore((state) => state.currentUserID);
    // let currentLessonID = useLessonStore((state) => state.currentLessonID);

    // console.log("🧪 Initial currentUserID:", currentUserID);
    // console.log("🧪 Initial currentLessonID:", currentLessonID);
    // console.log("Should have logged currentUserID and currentLessonID");

    const state = useLessonStore.getState();
    console.log("🧪 Zustand current state:", state);

    const unsubUserID = useLessonStore.subscribe(
      (state) => state.currentUserID,
      (id) => {
        console.log("✅ Updated currentUserID", id);
      }
    );
    console.log("📡 Subscribed to currentUserID");
    const unsubLessonID = useLessonStore.subscribe(
      (state) => state.currentLessonID,
      (id) => {
        console.log("✅ currentLessonID changed:", id);
      }
    );
    console.log("📡 Subscribed to currentLessonID");

    let debounceTimer;

    const unsubThinkPhase = useLessonStore.subscribe(
      (state) => state.thinkPhase,
      async (thinkPhase) => {
        clearTimeout(debounceTimer);
        // Get fresh state values each time
        debounceTimer = setTimeout(async () => {
          const { currentUserID, currentLessonID } = useLessonStore.getState();
          console.log("🧪 Updating thinkPhase");

          if (
            !Array.isArray(thinkPhase) ||
            !currentUserID ||
            !currentLessonID
          ) {
            console.log("⛔ Missing values", {
              thinkPhase,
              currentUserID,
              currentLessonID,
            });
            return;
          }

          console.log("🧪 Subscribing to thinkPhase changes...");
          console.log("🔥 Zustand: thinkPhase changed", {
            currentUserID,
            currentLessonID,
            thinkPhase,
          });

          const encodedStageID = encodeURIComponent("Think - Pair - Share");
          const stringifiedThinkPhase = JSON.stringify(thinkPhase);

          try {
            const response = await fetch(
              `/api/firestore/think-pair-share/post-think-pair-share?userID=${currentUserID}&lessonID=${currentLessonID}&stageID=${encodedStageID}&data=${stringifiedThinkPhase}&phase=think`,
              { method: "POST" }
            );
            const data = await response.json();
            console.log("✅ Autosaved to Firestore:", data);
          } catch (error) {
            console.error("❌ Error autosaving thinkPhase:", error);
          }
        }, 5000);
      }
    );
    console.log("📡 Subscribed to thinkPhase changes");

    // Test subscriber - fires on ANY state change
    const unsubTest = useLessonStore.subscribe(
      (state) => state, // Watch entire state
      (state) => {
        console.log("🔔 ANY state change:", {
          thinkPhase: state.thinkPhase,
          currentUserID: state.currentUserID,
          currentLessonID: state.currentLessonID,
        });
      }
    );

    const unsubAll = useLessonStore.subscribe(
      (state) => state,
      (state, prevState) => {
        console.log("🌐 Global state diff:", {
          new: state,
          prev: prevState,
          changed: Object.keys(state).filter(
            (key) => state[key] !== prevState[key]
          ),
        });
      }
    );

    return () => {
      clearTimeout(debounceTimer);
      unsubUserID();
      unsubLessonID();
      unsubThinkPhase();
      unsubTest();
      unsubAll();

      console.log("📴 All subscriptions unsubscribed");
    };
  }, []);

  return null;
}
