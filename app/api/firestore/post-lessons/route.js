import { db } from "@app/utils/firebaseAdmin";

export const POST = async () => {
  console.log("Trying to POST");

  try {
    // Example document write operation
    const citiesRef = db.collection("users");
    await citiesRef.doc("kevinstewartsmith").set({
      firstName: "Kevin",
      lastName: "Smith",
      userId: "kevinstewartsmith",
      country: "USA",
      lessons: [],
    });
    const lesson = {
      title: "Fuck this",
    };

    const lessonId = await postUserLesson("kevinstewartsmith", lesson);
    console.log(lessonId);

    // Add a section to the newly created lesson
    const section = {
      title: "Introduction to Example Lesson",
      content: "This is the introduction section.",
    };

    await postSectionToLesson("kevinstewartsmith", lessonId, section);
    console.log("Section successfully added!");

    return new Response("Document successfully written!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};

async function postUserLesson(userId, lesson) {
  const lessonsRef = db.collection("users").doc(userId).collection("lessons");

  const lessonDocRef = await lessonsRef.add(lesson);

  return lessonDocRef.id;
}

async function postSectionToLesson(userId, lessonId, section) {
  const sectionsRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections");

  await sectionsRef.add(section);
}
