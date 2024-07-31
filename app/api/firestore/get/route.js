// const Firestore = require("@google-cloud/firestore");
// import path from "path";
// const fs = require("fs");

import { Firestore } from "@google-cloud/firestore";
import path from "path";

import fs from "fs";

const directory = process.env.SERVICE_ACCOUNT_DIR;
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME;
const fire = "firebase-service-account.json";
console.log("Service account file: " + serviceFileName);
console.log("fire : " + fire);
//Service account file path
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
  directory,
  fire
  //serviceFileName
);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;
console.log("Service file exists: " + fs.existsSync(serviceFilePath));

const db = new Firestore({
  projectId: "esl-presentation-generator",
  //projectId: "esl-fire-gen",
  //keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_FIREBASE,
});

export const GET = async (request) => {
  console.log("trying to GET");
  try {
    const collectionName = "cities";

    // Get a reference to the collection
    const collectionRef = db.collection(collectionName);

    // Fetch all documents in the collection
    const snapshot = await collectionRef.get();

    // Extract document data
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(typeof documents[0].city_name);
    return new Response(documents[0].city_name + " " + documents[1].city_name, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 200 });
  }
};
