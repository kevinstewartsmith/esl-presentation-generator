"use client";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleFilled from "@mui/icons-material/PauseCircleFilled";
import { useEffect, useRef } from "react";
import { getFile } from "@app/utils/indexedDBWrapper";
import { combinedTranscript } from "@app/utils/transcript";
import { createAudioSlice } from "@app/utils/AudioSnipper";
import { playAudioFile, playAudioFileClip } from "@app/utils/AudioControls";
import { playFromIndexedDB } from "@app/utils/AudioSplittingUtil";
import { useState } from "react";
function SnippetPlayer({ index, snippetFileNames }) {
  const [playing, setPlaying] = useState(false);
  const currentAudioRef = useRef(null);

  const audioURL = "/api/audio";
  const audioContextRef = useRef(null);

  function findSnippetIndices(snippet, array) {
    const snippetWords = snippet.split(" ");
    const indices = [];

    for (let i = 0; i <= array.length - snippetWords.length; i++) {
      let match = true;

      for (let j = 0; j < snippetWords.length; j++) {
        if (array[i + j] !== snippetWords[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        indices.push({ start: i, end: i + snippetWords.length - 1 });
      }
    }

    return indices;
  }

  //   const snippet = "I'm playing football it's the cup final and I can't miss that of course not okay";
  //   const indices = findSnippetIndices(snippet, array);
  //   console.log(indices); // Output: [{ start: 62, end: 82 }]

  //pretty sure i'm not using this
  // useEffect(() => {
  //   // Create AudioContext only if it hasn't been created yet
  //   if (!audioContextRef.current) {
  //     window.AudioContext = window.AudioContext;
  //     audioContextRef.current = new AudioContext();
  //   }
  //   async function fetchAudioFile(audioURL) {
  //     try {
  //       const response = await fetch(audioURL);
  //       const arrayBuffer = await response.arrayBuffer();
  //       const buffer = await audioContextRef.current.decodeAudioData(
  //         arrayBuffer
  //       );
  //       updateAudioBuffer(buffer);
  //     } catch (error) {
  //       console.error("Error fetching or decoding audio file:", error);
  //     }
  //   }
  //   fetchAudioFile(audioURL);
  // }, [
  //   audioURL,
  //   //snippetBufferArray
  // ]);

  async function playSnippetClicked() {
    // If already playing, ignore the click (prevents overlap)
    if (playing) return;

    const snippetName = snippetFileNames[index];
    if (!snippetName || snippetName === "No Audio") {
      console.warn("No snippet available for this question.");
      return;
    }

    const blob = await getFile(snippetName);
    if (!(blob instanceof Blob) || blob.size === 0) {
      console.error("No valid audio blob for:", snippetName);
      return;
    }

    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    currentAudioRef.current = audio;

    setPlaying(true);

    audio.onended = () => {
      setPlaying(false);
      URL.revokeObjectURL(audioURL); // clean up
      currentAudioRef.current = null;
    };
    audio.onerror = () => {
      setPlaying(false);
      currentAudioRef.current = null;
    };

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setPlaying(false);
    });
  }
  function getTimeStamp(data) {
    //const data = {seconds: '19', nanos: 200000000};
    // Convert seconds to float
    const secondsFloat = data.seconds !== null ? parseFloat(data.seconds) : 0;

    // Convert nanos to float and adjust for decimal precision
    const nanosFloat =
      data.nanos !== null ? parseFloat(data.nanos) / Math.pow(10, 9) : 0;

    // Combine seconds and nanos
    const resultFloat = secondsFloat + nanosFloat;

    console.log(resultFloat); // Output: 19.2
    return resultFloat;
  }

  async function playSnippet(name, startTime, endTime) {
    const start = getTimeStamp(startTime);
    const end = getTimeStamp(endTime);
    console.log(start);
    console.log(end);
    // if (!fullAudioBuffer) return ;

    // const audioContext = new AudioContext();
    // audioContext.decodeAudioData(fullAudioBuffer, (buffer) => {
    //   const source = audioContext.createBufferSource();
    //   source.buffer = buffer;
    //   source.connect(audioContext.destination);
    //   source.start();
    // });
    console.log(startTime);
    console.log(startTime.seconds);
    console.log(startTime.nanos % 1000000000);
    console.log(endTime);

    console.log("Row Data:", name);
    try {
      const response = await fetch(`/api/audio?name=${name}`);

      if (!response.ok) {
        throw new Error("Failed to fetch audio file");
      }

      const audioBuffer = await response.arrayBuffer();
      //playAudioFile(audioBuffer)
      playAudioFileClip(audioBuffer, start, end);
      // const audioContext = new AudioContext();
      // const audioSource = audioContext.createBufferSource();
      // audioContext.decodeAudioData(audioBuffer, (buffer) => {
      //     audioSource.buffer = buffer;
      //     audioSource.connect(audioContext.destination);
      //     audioSource.start(0);
      // });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  function removeEmptyStrings(array) {
    return array.filter((item) => item !== "");
  }

  return (
    <div
      style={{
        backgroundColor: "transparent",
        width: "100px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={playSnippetClicked}
      value={index}
    >
      {snippetFileNames[index] == null ? (
        <span style={{ color: "#888", fontSize: "1rem" }}>No Audio</span>
      ) : playing ? (
        <PauseCircleFilled style={{ width: "100%", height: "100%" }} />
      ) : (
        <PlayCircleFilledWhiteIcon style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}

export default SnippetPlayer;
