import { db } from "@app/utils/firebaseAdmin";

export const postData = async (userID, lesson, section) => {
  try {
    const lessonId = await postUserLesson(userID, lesson);
    console.log(lessonId);

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
    .collection("Sections")
    .doc("teststage")
    .collection("testcollection")
    .doc("testdoc");

  await sectionsRef.set(section);
}

export const postInputs = async (
  userID,
  lessonId,
  stageID,
  key,
  value,
  data
) => {
  console.log("Posting inputs to Firestore");
  try {
    const parsedData = JSON.parse(data);
    await postInputsToStage(userID, lessonId, stageID, key, value, parsedData);
    return new Response("Inputs successfully added!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};

async function postInputsToStage(
  userId,
  lessonID,
  stageID,
  key,
  value,
  parsedData
) {
  const input = parsedData;
  console.log(parsedData);

  const inputsRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc("teststage")
    .collection("inputs")
    .doc("textInputs");

  await inputsRef.set(input);
}
