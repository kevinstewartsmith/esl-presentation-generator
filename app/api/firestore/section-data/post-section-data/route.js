import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    // Parse JSON body
    const { userID, lessonID, stageID, keyName, data } = await request.json();

    // Log the data
    console.log("UserID:", userID);
    console.log("LessonID:", lessonID);
    console.log("StageID:", stageID);
    console.log("KeyName:", keyName);
    console.log("Data:", data);
    console.log(`Posting updated Key: ${keyName} -  Listening Stage Data`);
    await postSectionData(userID, lessonID, stageID, keyName, data);

    return new Response(
      JSON.stringify({
        message: `Posted ${stageID} - ${keyName} successfully.`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error posting Complete Listening Stage Data.", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

async function postSectionData(userID, lessonID, stageID, keyName, data) {
  //If data is === "" or undefined replace it with __EMPTY__
  const cleanData =
    data === "" || data === undefined || data === null ? "__EMPTY__" : data;

  // Your logic to post the data to Firestore
  const sectionRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc(stageID);
  // .doc(stageID).collection("completeListening");
  //await sectionRef.add(parsedCompleteListeningStageData);
  await sectionRef.set({ [`${keyName}`]: cleanData }, { merge: true });
}
