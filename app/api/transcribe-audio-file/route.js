import path from "path";
const speech = require("@google-cloud/speech").v1p1beta1;
const fs = require("fs");

// Service account setup
const directory = process.env.SERVICE_ACCOUNT_DIR;

const serviceFileName = process.env.SERVICE_ACCOUNT_NAME;
const serviceFilePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  directory,
  serviceFileName
);
//const serviceFilePath = path.join(process.cwd(), directory, serviceFileName);
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;
console.log("Service file exists: " + fs.existsSync(serviceFilePath));

// No need for bodyParser config in App Router

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No audio file uploaded." }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBytes = buffer.toString("base64");

    const encoding = formData.get("encoding") || "MP3";
    const sampleRateHertz = formData.get("sampleRateHertz")
      ? parseInt(formData.get("sampleRateHertz"))
      : 44100;
    const languageCode = formData.get("languageCode") || "en-UK";

    const text = await transcribeAudioFromBlob(
      audioBytes,
      encoding,
      sampleRateHertz,
      languageCode
    );

    return new Response(JSON.stringify(text), { status: 200 });
  } catch (error) {
    console.log("google-api-s2t error: " + error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      { status: 500 }
    );
  }
}

async function transcribeAudioFromBlob(
  audioBase64,
  encoding,
  sampleRateHertz,
  languageCode
) {
  try {
    const speechClient = new speech.SpeechClient();
    const audio = { content: audioBase64 };
    const config = {
      encoding,
      sampleRateHertz,
      languageCode,
      enableWordTimeOffsets: true,
      enableSpeakerDiarization: true,
      minSpeakerCount: 2,
      maxSpeakerCount: 3,
      model: "latest_long",
    };

    const [operation] = await speechClient.longRunningRecognize({
      audio,
      config,
    });
    const [response] = await operation.promise();
    return response.results;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
