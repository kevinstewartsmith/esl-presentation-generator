import { db } from "@app/utils/firebaseAdmin";
import { postData, postInputs } from "@app/utils/FirestorePostMethods";

export const POST = async (request) => {
  console.log("Trying to POST");
  const url = new URL(request.url);
  const userID = url.searchParams.get("userID");
  const lessonID = url.searchParams.get("lessonID");
  const lessonTitle = url.searchParams.get("lessonTitle");
  const method = url.searchParams.get("method");
  const stageID = url.searchParams.get("stageID");
  const key = url.searchParams.get("key");
  const value = url.searchParams.get("value");
  const data = url.searchParams.get("data");
  console.log("Method INSIDE POST: ", method);
  console.log("Lesson ID INSIDE POST: ", lessonID);
  const lesson = {
    title: lessonTitle,
    stageOrder: [
      "Class Rules",
      "Effort and Attitude Score",
      "Warm-Up: Speaking",
    ],
    unincludedStageOrder: [
      "Warm-Up: Board Race",
      "Reading For Gist and Detail",
      "Listening for Gist and Detail",
      "Advantages - Disadvantages",
      "Brainstorming",
      "Speaking: Debate",
      "Writing: Essay",
      "Speaking: Role Play",
      "Speaking: Presentation",
      "Speaking: Survey",
      "Think - Pair - Share",
      "Vocabulary",
    ],
  };
  const sectionID = "ReadingforGistandDetail";
  const section = {
    title: "Introduction to Example Lesson",
    content: "This is the introduction section.",
    sectionType: "ReadingforGist",
  };
  switch (method) {
    case "postLessonInput":
      return postInputs(userID, lessonID, stageID, key, value, data);
    default:
      return postData(userID, lesson, section);
  }

  //return postData(userID, lesson, section);
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
    .doc("Reading For");

  await sectionsRef.set(section);
}

// async function postSectionCategoryToLesson(userId, lessonId, section) {
//   const sectionsRef = db
//     .collection("users")
//     .doc(userId)
//     .collection("lessons")
//     .doc(lessonId)
//     .collection("Sections");

//   await sectionsRef.add(section);
// }
