// pages/api/upload.js

import { Storage } from "@google-cloud/storage";
import multer from "multer";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

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

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

const upload = multer({ dest: "/tmp" });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const POST = async function handler(req, res) {
  console.log("attempting to upload");
  try {
    console.log("trying");
    // File is available in req.file
    const file = req.file;
    console.log(file.originalname);
    if (!file) {
      return new Response({ error: "No file provided", status: 400 });
    }

    const bucket = storage.bucket(bucketName);
    const fileBlob = bucket.file(file.originalname);
    console.log("File blob: " + fileBlob);

    // Upload the file to Google Cloud Storage
    await fileBlob.save(file.buffer);

    //return res.status(200).json({ success: true });
    return new Response("sheeit", { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(error);
  }
};
