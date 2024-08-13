import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to POST Lesson Stages");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    // const stages = url.searchParams.get("stages");
    // const parsedStages = JSON.parse(stages);
    // console.log(typeof parsedStages);

    // const includedStages = parsedStages.root;
    // console.log("Included Stages: ", includedStages);

    // includedStages.forEach((stage) => {
    //   console.log(stage);
    //   postSectionsToLesson(userID, lessonID, stage);
    // });

    const response = getLessonStages(userID, lessonID);
    console.log("STAGES INSIDE POST: ", lessonID);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

async function postUserLesson(userId, lesson) {
  const lessonsRef = db.collection("users").doc(userId).collection("lessons");
  const lessonDocRef = await lessonsRef.add(lesson);
  return lessonDocRef.id;
}
async function updateUserLesson(userId, lessonId) {
  const lessonRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId);

  await lessonRef.set(lesson, { merge: true }); // Merges the new data with the existing document
  return lessonId;
}

async function postSectionsToLesson(userId, lessonId, sectionId) {
  const sectionRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections")
    .doc(sectionId); // Use sectionId as the document ID

  const sectionDoc = await sectionRef.get();

  // Check if the section already exists
  if (!sectionDoc.exists) {
    // Add the new section with the name
    await sectionRef.set({ name: sectionId });
    console.log(
      `Section ${sectionId} with name "${sectionId}" added to lesson ${lessonId}.`
    );
  } else {
    console.log(`Section ${sectionId} already exists in lesson ${lessonId}.`);
  }
}

async function getLessonStages(userID, lessonID) {
  //const lessonsRef = db.collection(doc(db, "users", userId), "lessons");
  //const lessonsRef = db.collection(db, "users", userId, "lessons");
  const stagesRef = db
    //.firestore()
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections");
  const stagesSnapshot = await stagesRef.get();
  const stages = stagesSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Include the document fields
  }));
  console.log(stages);
  return stages;
}
