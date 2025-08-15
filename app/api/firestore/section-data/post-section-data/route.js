import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    console.log("Posting Complete Listening Stage Data");

    // Parse JSON body
    const { userID, lessonID, stageID, data } = await request.json();

    // Log the data
    console.log("UserID:", userID);
    console.log("LessonID:", lessonID);
    console.log("StageID:", stageID);
    console.log("Data:", data);

    await postCompleteListeningStageData(userID, lessonID, stageID, data);

    return new Response(
      JSON.stringify({
        message: "Complete Listening Stage Data posted successfully.",
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

async function postCompleteListeningStageData(userID, lessonID, stageID, data) {
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
  await sectionRef.set({ completeListeningStageData: data }, { merge: true });
}
