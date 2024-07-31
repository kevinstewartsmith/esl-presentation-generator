// lib/firebaseAdmin.js
import admin from "firebase-admin";
import path from "path";
import fs from "fs";

console.log("CONNECTING DB");
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
console.log("PATHGHHH: " + serviceFilePath);
// Path to the service account JSON file
const serviceAccountPath = path.resolve(
  "./config/firebaseServiceAccountKey.json"
);

const serviceAccount = JSON.parse(fs.readFileSync(serviceFilePath, "utf8"));
//console.log(serviceAccount);
console.log("Service ACCCC: " + JSON.stringify(serviceAccount));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // Optional: Set the Firestore database URL
//   // databaseURL: 'https://your-database-name.firebaseio.com',
// });
// // }

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccount, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("RRRRRRFirebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

const db = admin.firestore();
console.log("DB Connected?????");

export { db };
