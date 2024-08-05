import { db } from "./firebaseAdmin";

export const getData = async (method, userID, lessonID) => {
  console.log("UTILLLLL + " + method);
  switch (method) {
    case "getOneLesson":
      return await getUserLesson(userID, lessonID);
    case "getAllLessons":
      return await getUserLessonsCollection(userID);
    default:
      return null;
  }
};

async function getUserLesson(userID, lessonID) {
  const lessonRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID);
  const lessonSnapshot = await lessonRef.get();
  const lesson = {
    id: lessonSnapshot.id,
    ...lessonSnapshot.data(),
  };
  console.log(lesson);
  return lesson;
}

async function getUserLessonsCollection(userID) {
  //const lessonsRef = db.collection(doc(db, "users", userId), "lessons");
  //const lessonsRef = db.collection(db, "users", userId, "lessons");
  const lessonsRef = db
    //.firestore()
    .collection("users")
    .doc(userID)
    .collection("lessons");
  const lessonsSnapshot = await lessonsRef.get();
  const lessons = lessonsSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Include the document fields
  }));
  console.log(lessons);
  return lessons;
}
