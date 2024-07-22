"use client";
import { useState, Fragment, useContext, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { Grid, Item } from "@mui/material";
import AudioSlicer from "./components/AudioSlicer";
import { AudioTextContext } from "./contexts/AudioTextContext";
import Player from "./components/Player";
import LlamaButton from "./components/LlamaButton";
import { transcribeAudioTest } from "./utils/speech-to-text";
import Link from "next/link";
import QuestionDisplay from "./components/QuestionDisplay";
import UploadOneMP3 from "./components/UploadOneMP3";
import AudioTable from "./components/AudioTable";
import Transcript from "./components/Transcript";
import Presentation from "./components/Presentation";

export default function Home() {
  return (
    <div>
      <h1>ESL Presentation Generator</h1>
      <button>Get Started</button>
    </div>
  );
}
