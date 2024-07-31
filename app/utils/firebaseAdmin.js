import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const serviceAccountPath = path.resolve("./config/firebaseServiceAccount.json");
//console.log("Reading service account JSON file from:", serviceAccountPath);

const rawJson = fs.readFileSync(serviceAccountPath, "utf8");
//console.log("Raw JSON content:", rawJson);

const serviceAccountJSON = JSON.parse(rawJson);
//console.log("Parsed JSON:", serviceAccountJSON);

// Resolve the path to the service account JSON file
// const serviceAccountPath = path.resolve("./config/firebaseServiceAccount.json");

// Check if the file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Service account file not found at:", serviceAccountPath);
  throw new Error("Service account file not found");
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJSON),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

const db = admin.firestore();
console.log("Firestore DB Connected");

export { db };
