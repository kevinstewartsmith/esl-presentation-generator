//Fetches audio from Google Cloud Storage bucket and returns it as a response
import { Storage } from "@google-cloud/storage";
import path from "path";

const directory = process.env.SERVICE_ACCOUNT_DIR;
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME;

//const serviceFilePath = path.join(__dirname, "..", "..", "..", "..","..","..","..", directory, serviceFileName);
const serviceFilePath = path.join(
  process.cwd(),
  "..",
  directory,
  serviceFileName,
);
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;

const bucketName = process.env.BUCKET_NAME;
//const fileName = process.env.FILE_NAME

export const GET = async (request) => {
  const urlQuery = new URL(request.url);
  const name = urlQuery.searchParams.get("name");
  console.log("File name in audio route server: " + name);

  const storage = new Storage();
  const file = storage.bucket(bucketName).file(name);

  try {
    const audioBuffer = await fetchAudioFromBucket(file);

    return new Response(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mp3" },
    });
  } catch (error) {
    console.error("Error getting audio:", error);
    return new Response(error);
  }
};

async function fetchAudioFromBucket(file, startTime, endTime) {
  try {
    const fileData = await file.download();
    const audioBuffer = fileData[0];

    return audioBuffer;
  } catch (error) {
    console.error("Error fetching audio from bucket:", error);
    throw error;
  }
}

// function sliceAudioSnippet(audioBuffer, startTime, endTime) {
//   //const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128); // Mono, 44100Hz, 128kbps
//   const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);

//   const startOffset = Math.floor(startTime * 44100 * 2); // 44100 samples per second, 2 bytes per sample for mono
//   const endOffset = Math.floor(endTime * 44100 * 2);

//   const slicedBuffer = audioBuffer.slice(startOffset, endOffset);
//   const mp3Data = mp3Encoder.encodeBuffer(slicedBuffer);

//   return mp3Data.data;
// }
