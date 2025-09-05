import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

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
  "..",
  "..",
  directory,
  serviceFileName
);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;

const bucketName = process.env.BUCKET_NAME;

export async function POST(request) {
  console.log("AUDIO UPLOADER!!!");

  try {
    // Parse multipart form data (audio file as 'audio')
    const formData = await request.formData();
    const file = formData.get("audio");
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No audio file uploaded." }),
        { status: 400 }
      );
    }

    // const fileName =
    //   formData.get("fileName") || file.name || `audio-${Date.now()}.mp3`;
    const filePath =
      formData.get("filePath") || file.name || `audio-${Date.now()}.mp3`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Uploading to bucket:", bucketName);
    console.log("File path:", filePath);
    console.log("Buffer length:", buffer.length);
    console.log("Service file exists:", fs.existsSync(serviceFilePath));

    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const gcFile = bucket.file(filePath);

    // Upload the buffer to the bucket
    await gcFile.save(buffer, {
      contentType: file.type || "audio/mp3",
      resumable: false,
      public: false,
    });

    return new Response(JSON.stringify({ success: true, filePath }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
