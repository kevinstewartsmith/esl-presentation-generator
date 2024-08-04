import { db } from "@app/utils/firebaseAdmin";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";

export const GET = async (request) => {
  console.log("trying to GET");
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const lessonId = url.searchParams.get("lessonId");
    const getMethod = url.searchParams.get("method");
    const collectionName = "users";
    console.log("Search Params: ", userId, lessonId, getMethod);

    let data = null;
    if (getMethod === "getOneLesson") {
      data = await getUserLesson(userId, lessonId);
    } else {
      data = await getUserLessonsCollection(userId);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }

  async function getUserLessonsCollection(userId) {
    //const lessonsRef = db.collection(doc(db, "users", userId), "lessons");
    //const lessonsRef = db.collection(db, "users", userId, "lessons");
    const lessonsRef = db
      //.firestore()
      .collection("users")
      .doc(userId)
      .collection("lessons");
    const lessonsSnapshot = await lessonsRef.get();
    const lessons = lessonsSnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Include the document fields
    }));
    console.log(lessons);
    return lessons;
  }

  async function getUserLesson(userId, lessonId) {
    const lessonRef = db
      .collection("users")
      .doc(userId)
      .collection("lessons")
      .doc(lessonId);
    const lessonSnapshot = await lessonRef.get();
    const lesson = {
      id: lessonSnapshot.id,
      ...lessonSnapshot.data(),
    };
    console.log(lesson);
    return lesson;
  }
};
