import { getFile, listFiles, saveFile } from "@app/utils/IndexedDBWrapper";

export const splitAudioFile = async (completeListeningStageData) => {
  console.log(
    "Splitting audio file...",
    completeListeningStageData.audioFileName
  );
  console.log(
    "Complete Listening Stage Data Questions and Answers in the CLIP UTIL:",
    completeListeningStageData.questionsAndAnswers
  );
  const audioContext = new AudioContext();
  const keys = await listFiles(); // or your version of listing
  console.log("Keys in DB:", keys);

  console.log("Looking for:", completeListeningStageData.audioFileName);
  console.log("Available keys:", keys);
  // Check if audio file name and keys[0] match
  console.log(
    "Keys[0] === audioFileName:",
    keys[0] === completeListeningStageData.audioFileName
  );

  // Retrieve the binarized audio file from IndexedDB
  const audioBlob = await getAudioBlob(
    completeListeningStageData.audioFileName
  );
  if (!audioBlob) {
    console.error("Audio file not found.");
    return [];
  }

  const decodedAudioBuffer = await decodeAudioFile(audioBlob, audioContext);
  await splitAudioFileIntoMultipleClips(
    decodedAudioBuffer,
    completeListeningStageData,
    audioContext
  );

  // getFile("Thk2e_BE_L2_SB_Unit_5_p51_t05.mp3_snippet_1.wav").then((file) => {
  //   if (file && file.blob instanceof Blob) {
  //     const audioUrl = URL.createObjectURL(file.blob);
  //     const audio = new Audio(audioUrl);
  //     audio.play().catch((err) => {
  //       console.error("Playback error:", err);
  //     });
  //     console.log(audio); // ✅ logs Audio object, not a Promise
  //   } else {
  //     console.error("Invalid or missing Blob:", file);
  //   }
  // });
};

async function splitAudioFileIntoMultipleClips(
  audioBuffer,
  completeListeningStageData,
  audioContext
) {
  const questionsAndAnswers = completeListeningStageData.questionsAndAnswers;
  const snippets = [];
  const indices = questionsAndAnswers.map((qa) => qa.indices || "no indices");
  const wordArray = completeListeningStageData.wordArray;

  console.log("Indices for snippets:", indices);

  for (let i = 0; i < indices.length; i++) {
    try {
      const currentIndex = indices[i];

      if (
        !currentIndex ||
        currentIndex === "no indices" ||
        !wordArray ||
        !wordArray[currentIndex.start] ||
        !wordArray[currentIndex.end]
      ) {
        console.warn(
          `Skipping snippet creation for question ${i}. Missing indices or word data.`
        );
        snippets.push("No Audio");
        continue;
      }

      const { start: startIndex, end: endIndex } = currentIndex;

      const start = wordArray[startIndex]?.startTime
        ? getSeconds(wordArray[startIndex].startTime)
        : NaN;
      const end = wordArray[endIndex]?.endTime
        ? getSeconds(wordArray[endIndex].endTime)
        : NaN;

      console.log(`Start: ${start}, End: ${end} for question ${i}`);

      if (isNaN(start) || isNaN(end) || end <= start) {
        console.warn(`Invalid start or end time for question ${i}:`, {
          start,
          end,
        });
        snippets.push("No Audio");
        continue;
      }

      const snippetBlob = await createSnippetBlob(
        audioContext,
        audioBuffer,
        start,
        end
      );

      if (snippetBlob) {
        snippets.push(snippetBlob);
        await saveFile(
          `${completeListeningStageData.audioFileName}_snippet_${i}.wav`,
          snippetBlob
        );
      } else {
        snippets.push("No Audio");
      }
    } catch (err) {
      console.error(`Error processing question ${i}:`, err);
      snippets.push("No Audio");
    }
  }

  console.log("Final snippets array:", snippets);
}

//Retrieve audio blob from IndexedDB
async function getAudioBlob(fileName) {
  try {
    const fileBlob = await getFile(fileName);
    if (fileBlob) {
      console.log(`File ${fileName} retrieved from IndexedDB.`);
      return fileBlob;
      //return fileBlob?.blob ?? null;
    } else {
      console.error(`File ${fileName} not found in IndexedDB.`);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving file from IndexedDB:", error);
    return null;
  }
}

//Decode the audio file
async function decodeAudioFile(audioBlob, audioContext) {
  //const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return audioBuffer;
}

export function splitIntoClips(audioBlob, wordArray) {
  if (!audioBlob || !wordArray || wordArray.length === 0) {
    console.error("Invalid audio blob or word array.");
    return [];
  }
}

function getSeconds(timeObj) {
  const seconds =
    typeof timeObj.seconds === "string"
      ? parseInt(timeObj.seconds)
      : timeObj.seconds;
  return seconds + timeObj.nanos / 1e9;
}

export const createSnippetBlob = async (
  audioContext,
  audioBuffer,
  startTime,
  endTime
) => {
  try {
    const sampleRate = audioBuffer.sampleRate;
    const startFrame = Math.floor(startTime * sampleRate);
    const endFrame = Math.floor(endTime * sampleRate);
    const frameCount = endFrame - startFrame;

    if (frameCount <= 0) {
      console.warn("Skipping snippet with invalid frame count:", {
        startTime,
        endTime,
        frameCount,
      });
      return null;
    }

    const snippetBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      frameCount,
      sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer
        .getChannelData(channel)
        .slice(startFrame, endFrame);
      snippetBuffer.copyToChannel(channelData, channel);
    }

    const snippetBlob = await audioBufferToWavBlob(snippetBuffer);
    return snippetBlob;
  } catch (error) {
    console.error("Error creating snippet blob:", error, {
      startTime,
      endTime,
    });
    return null;
  }
};

function playAudioBuffer(audioBuffer) {
  const audioContext = new AudioContext(); // ✅ define it here
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

async function createSnippetWavBlob(audioBuffer, start, end) {
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);
  const frameCount = endSample - startSample;

  const snippetBuffer = new AudioContext().createBuffer(
    audioBuffer.numberOfChannels,
    frameCount,
    sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const sourceData = audioBuffer.getChannelData(channel);
    const targetData = snippetBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      targetData[i] = sourceData[startSample + i];
    }
  }

  return audioBufferToWavBlob(snippetBuffer);
}

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  let offset = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  }

  function writeUint32(val) {
    view.setUint32(offset, val, true);
    offset += 4;
  }

  function writeUint16(val) {
    view.setUint16(offset, val, true);
    offset += 2;
  }

  // RIFF chunk descriptor
  writeString("RIFF");
  writeUint32(bufferLength - 8); // file length - 8
  writeString("WAVE");

  // fmt subchunk
  writeString("fmt ");
  writeUint32(16); // Subchunk1Size (PCM)
  writeUint16(format);
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(byteRate);
  writeUint16(blockAlign);
  writeUint16(bitsPerSample);

  // data subchunk
  writeString("data");
  writeUint32(dataLength);

  // Write PCM samples
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = buffer.getChannelData(ch)[i];
      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

// export async function playFromIndexedDB(key) {
//   const entry = await getFile(key);
//   if (!entry || !(entry.blob instanceof Blob)) {
//     console.error("No valid Blob found for:", key, entry);
//     return;
//   }
//   const url = URL.createObjectURL(entry.blob);
//   const audio = new Audio(url);
//   audio.play().catch((err) => console.error("Playback failed:", err));
//   console.log("Playing:", key);
// }

export async function playFromIndexedDB(fileName) {
  listFiles().then(console.log);
  const blob = await getFile(fileName);

  if (!(blob instanceof Blob) || blob.size === 0) {
    console.error(`No valid Blob found for: ${fileName}`, blob);
    return;
  }

  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  audio
    .play()
    .then(() => console.log(`Playing: ${fileName}`))
    .catch((err) => console.error("Playback failed:", err));
}
window.playFromIndexedDB = playFromIndexedDB;
