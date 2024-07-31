//const Firestore = require("@google-cloud/firestore");
import { Firestore } from "@google-cloud/firestore";
import path from "path";
//const fs = require("fs");
import fs from "fs";
import { db } from "@app/utils/firebaseAdmin";
// import { initializeApp } from "firebase-admin";
// const app = initializeApp();
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyBZri-bqB1QkGcFyzdhYNtYIAg3Gou9DqY",
//   authDomain: "esl-presentation-generator.firebaseapp.com",
//   databaseURL: "https://esl-presentation-generator-default-rtdb.firebaseio.com",
//   projectId: "esl-presentation-generator",
//   storageBucket: "esl-presentation-generator.appspot.com",
//   messagingSenderId: "168876691330",
//   appId: "1:168876691330:web:0659ee9a73ee9e91c6099b",
//   measurementId: "G-LFPC6528F8",
// };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
console.log("POST");
console.log("Temporarily printing");
console.log(process.env.FIRESTORE_SERVICE_ACCOUNT);
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

// const db = new Firestore({
//   projectId: "esl-presentation-generator",
//   //keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

// const db = new Firestore({
//   projectId: "esl-presentation-generator",
//   //projectId: "esl-fire-gen",
//   //keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_FIREBASE,
// });

export const POST = async () => {
  console.log("Trying to POST");

  try {
    // Example document write operation
    const citiesRef = db.collection("cities");
    await citiesRef.doc("SF").set({
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
    });

    return new Response("Document successfully written!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};
