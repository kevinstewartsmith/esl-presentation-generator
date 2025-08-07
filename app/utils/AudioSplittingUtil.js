import { getFile, listFiles, saveFile } from "@app/utils/IndexedDBWrapper";

export const splitAudioFile = async (completeListeningStageData) => {
  console.log(
    "Splitting audio file...",
    completeListeningStageData.audioFileName
  );
  listFiles().then((files) => {
    console.log("Files in IndexedDB:", files);
  });
  // Retrieve the binarized audio file from IndexedDB
  const audioBlob = await getAudioBlob(
    completeListeningStageData.audioFileName
  );
  if (!audioBlob) {
    console.error("Audio file not found.");
    return [];
  }
  const audioBuffer = await decodeAudioFile(audioBlob);
  console.log("Audio buffer decoded:", audioBuffer);
  //playAudioBuffer(audioBuffer);
  const snippetBlob = await createSnippetWavBlob(audioBuffer, 10, 15); // from 10s to 15s
  saveFile(
    completeListeningStageData.audioFileName + "_snippet.wav",
    snippetBlob
  )
    .then(() => {
      console.log("Snippet saved to IndexedDB.");
    })
    .catch((error) => {
      console.error("Error saving snippet to IndexedDB:", error);
    });
  const url = URL.createObjectURL(snippetBlob);
  const audio = new Audio(url);
  audio.play();
};

//Retrieve audio blob from IndexedDB
async function getAudioBlob(fileName) {
  try {
    const fileBlob = await getFile(fileName);
    if (fileBlob) {
      console.log(`File ${fileName} retrieved from IndexedDB.`);
      return fileBlob;
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
async function decodeAudioFile(audioBlob) {
  const audioContext = new AudioContext();
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
  return timeObj.seconds + timeObj.nanos / 1e9;
}

async function createSnippetBlob(audioBuffer, start, end) {
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);
  const frameCount = endSample - startSample;

  const snippetBuffer = audioContext.createBuffer(
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

  // Convert buffer to WAV blob
  return audioBufferToWavBlob(snippetBuffer);
}

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
