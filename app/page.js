"use client";
import { useState, Fragment, useContext, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { Grid, Item } from "@mui/material";
import AudioSlicer from "./create/components/AudioSlicer";
import { AudioTextContext } from "./contexts/AudioTextContext";
import Player from "./create/components/Player";
import LlamaButton from "./create/components/LlamaButton";
import { transcribeAudioTest } from "./utils/speech-to-text";
import Link from "next/link";
import QuestionDisplay from "./create/components/QuestionDisplay";
import UploadOneMP3 from "./create/components/UploadOneMP3";
import AudioTable from "./create/components/AudioTable";
import Transcript from "./create/components/Transcript";
import Presentation from "./create/components/Presentation";

export default function Home() {
  return (
    <div>
      <h1>ESL Presentation Generator</h1>
      <button>Get Started</button>
    </div>
  );
}
