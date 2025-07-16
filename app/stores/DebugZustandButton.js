// components/ZustandDebugButton.js
"use client";
import { useLessonStore } from "@app/stores/UseLessonStore";

export default function ZustandDebugButton() {
  const dumpState = () => {
    const state = useLessonStore.getState();
    console.log("🟢 FULL ZUSTAND STATE:", JSON.parse(JSON.stringify(state)));
  };

  return (
    <button
      onClick={dumpState}
      style={{
        padding: "6px 10px",
        margin: "8px",
        background: "#222",
        color: "#fff",
        borderRadius: 4,
      }}
    >
      🩻 Dump Zustand State
    </button>
  );
}
