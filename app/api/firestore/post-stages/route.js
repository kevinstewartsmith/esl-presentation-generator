import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  console.log("Trying to POST Lesson Stages");
  const url = new URL(request.url);
  const userID = url.searchParams.get("userID");
  const lessonID = url.searchParams.get("lessonID");
  const stages = url.searchParams.get("stages");

  console.log("Lesson ID INSIDE POST: ", lessonID);
  console.log("Stages INSIDE POST: ", stages);
  console.log("User ID INSIDE POST: ", userID);
};

async function postUserLesson(userId, lesson) {
  const lessonsRef = db.collection("users").doc(userId).collection("lessons");
  const lessonDocRef = await lessonsRef.add(lesson);
  return lessonDocRef.id;
}

async function postSectionsToLesson(userId, lessonId, section, sectionID) {
  const sectionsRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections")
    .doc(SectionID);

  await sectionsRef.set(section);
}
