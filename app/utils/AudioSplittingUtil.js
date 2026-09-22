import { getFile, listFiles, saveFile } from "@app/utils/indexedDBWrapper";
import { getAudioBlob } from "@app/utils/AudioStorage";

export const splitAudioFile = async (
  audioFileName,
  wordArray,
  questionsAndAnswers,
) => {
  console.log("Splitting audio file...", audioFileName);
  const audioContext = new AudioContext();

  // Retrieve the binarized audio file from IndexedDB (or bucket fallback).
  const audioBlob = await getAudioBlob(audioFileName);
  if (!audioBlob) {
    console.error("Audio file not found.");
    return [];
  }

  const decodedAudioBuffer = await decodeAudioFile(audioBlob, audioContext);
  const clipsByQuestion = await splitAudioFileIntoMultipleClips(
    decodedAudioBuffer,
    audioFileName,
    wordArray,
    questionsAndAnswers,
    audioContext,
  );
  return clipsByQuestion;
};

// Returns clipsByQuestion: an array aligned to questionsAndAnswers, where
// clipsByQuestion[i] is an array aligned to that question's passages[]. Each
// entry is a saved clip filename, or "No Audio" when the passage couldn't be
// located / timed.
async function splitAudioFileIntoMultipleClips(
  audioBuffer,
  audioFileName,
  wordArray,
  questionsAndAnswers,
  audioContext,
) {
  const clipsByQuestion = [];

  for (let i = 0; i < questionsAndAnswers.length; i++) {
    const passages = questionsAndAnswers[i]?.passages ?? [];
    const clipsForQuestion = [];

    for (let j = 0; j < passages.length; j++) {
      const currentIndex = passages[j]?.indices;

      try {
        if (
          !currentIndex ||
          !wordArray ||
          !wordArray[currentIndex.start] ||
          !wordArray[currentIndex.end]
        ) {
          console.warn(
            `Skipping clip for Q${i} P${j}: missing indices or word data.`,
          );
          clipsForQuestion.push("No Audio");
          continue;
        }

        const { start: startIndex, end: endIndex } = currentIndex;

        const start = wordArray[startIndex]?.startTime
          ? getSeconds(wordArray[startIndex].startTime)
          : NaN;
        const end = wordArray[endIndex]?.endTime
          ? getSeconds(wordArray[endIndex].endTime) + 0.5
          : NaN;

        if (isNaN(start) || isNaN(end) || end <= start) {
          console.warn(`Invalid start/end for Q${i} P${j}:`, { start, end });
          clipsForQuestion.push("No Audio");
          continue;
        }

        const snippetBlob = await createSnippetBlob(
          audioContext,
          audioBuffer,
          start,
          end,
        );

        if (snippetBlob) {
          // _i_j keeps each passage's clip unique (was _i, which collided when
          // a question had more than one passage).
          const name = `${audioFileName}_snippet_${i}_${j}.wav`;
          clipsForQuestion.push(name);
          await saveFile(name, snippetBlob);
        } else {
          clipsForQuestion.push("No Audio");
        }
      } catch (err) {
        console.error(`Error processing Q${i} P${j}:`, err);
        clipsForQuestion.push("No Audio");
      }
    }

    clipsByQuestion.push(clipsForQuestion);
  }

  console.log("Final clipsByQuestion:", clipsByQuestion);
  return clipsByQuestion;
}

//Decode the audio file
async function decodeAudioFile(audioBlob, audioContext) {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function getSeconds(timeObj) {
  if (!timeObj) return 0;
  const seconds =
    typeof timeObj.seconds === "string"
      ? parseInt(timeObj.seconds)
      : timeObj.seconds || 0;
  const nanos = timeObj.nanos || 0;
  return seconds + nanos / 1e9;
}

export const createSnippetBlob = async (
  audioContext,
  audioBuffer,
  startTime,
  endTime,
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
      sampleRate,
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

export async function playFromIndexedDB(fileName) {
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
