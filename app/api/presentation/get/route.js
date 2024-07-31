// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import path from 'path';
// var admin = require("firebase-admin");
import path from "path";
// Import the Google Cloud Speech library.
const fs = require("fs");
const Firestore = require("@google-cloud/firestore");

// const directory = process.env.SERVICE_ACCOUNT_DIR
// const firebaseServiceFileName = process.env.FIREBASE_SERVICE_ACCOUNT_NAME

// //Service account file path
// const serviceFilePath = path.join(__dirname,"..", "..", "..", "..", "..","..","..","..", directory, firebaseServiceFileName);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceFilePath),
//   databaseURL: "https://esl-presentation-generator-default-rtdb.firebaseio.com"
// });

// // TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//     apiKey: process.env.apiKey,
//     authDomain: process.env.authDomain,
//     projectId: process.env.projectId,
//     storageBucket:process.env.storageBucket ,
//     messagingSenderId: process.env.messagingSenderId,
//     appId: process.env.appId,
//     measurementId: process.env.measurementId
//   };
const directory = process.env.SERVICE_ACCOUNT_DIR;
const serviceFileName = process.env.SERVICE_ACCOUNT_NAME;

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
  serviceFileName
);

process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceFilePath;
console.log("Service file exists: " + fs.existsSync(serviceFilePath));
// fs.readFile(serviceFilePath, 'utf8', (err, data) => {
//   if (err) {
//       console.error('Error reading service account file:', err);
//   } else {
//       console.log('Service Account JSON:', data);
//   }
// });

const firestore = new Firestore();
const collectionRef = firestore.collection("test");

export const GET = async (request) => {
  try {
    const data = await listCollections();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Can't get data, bro", { status: 500 });
  }
};
async function listCollections(databaseName) {
  try {
    const collections = [];
    console.log("oh no");
    const collectionsRef = await firestore.listCollections();
    console.log("Collections");
    console.log(collectionsRef);
    for await (const collection of collectionsRef) {
      collections.push(collection.id);
    }
    return collections;
  } catch (error) {
    console.error("Error listing collections:", error);
    throw error;
  }
}

// Get a list of cities from your database
