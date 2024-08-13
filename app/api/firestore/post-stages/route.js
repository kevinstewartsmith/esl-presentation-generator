import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    console.log("POST Lesson Stages");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stages = url.searchParams.get("stages");
    const parsedStages = JSON.parse(stages);
    const includedStages = parsedStages.root;
    const unincludedStages = parsedStages.container1;

    includedStages.forEach((stage) => {
      postSectionsToLesson(userID, lessonID, stage);
    });

    postStageOrderToLesson(userID, lessonID, includedStages);
    postUnincludedStageOrderToLesson(userID, lessonID, unincludedStages);

    return new Response("Lesson Stages posted successfully.", {
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

async function postStageOrderToLesson(userId, lessonId, stageOrder) {
  const stageOrderRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId);
  // .collection("Sections")
  // .doc("stageOrder");
  console.log("POSTING STAGE ORDER");

  await stageOrderRef.set({ stageOrder: stageOrder }, { merge: true });
  console.log(`Stage Order ${stageOrder} added to lesson ${lessonId}.`);

  //return stageOrder;
}

async function postUnincludedStageOrderToLesson(
  userId,
  lessonId,
  unincludedStageOrder
) {
  const stageOrderRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId);
  // .collection("Sections")
  // .doc("stageOrder");
  console.log("POSTING UNINCLUDED STAGE ORDER");

  await stageOrderRef.set(
    { unincludedStageOrder: unincludedStageOrder },
    { merge: true }
  );
  console.log(
    `Unincluded Stage Order ${unincludedStageOrder} added to lesson ${lessonId}.`
  );

  //return stageOrder;
}
