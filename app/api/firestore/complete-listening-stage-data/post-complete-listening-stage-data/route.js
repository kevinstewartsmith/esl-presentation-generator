import { db } from "@app/utils/firebaseAdmin";
import { replaceEmptyWithPlaceholder } from "@app/utils/ReplaceEmptyWithPlaceholder";

export const POST = async (request) => {
  try {
    console.log("Posting Complete Listening Stage Data");

    const { userID, lessonID, stageID, data } = await request.json();

    // Replace empty fields with placeholders
    const cleanedData = replaceEmptyWithPlaceholder(data);

    // Post the data to Firestore
    await postCompleteListeningStageData(
      userID,
      lessonID,
      stageID,
      cleanedData
    );

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
  const docRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc(stageID);

  await docRef.set({ completeListeningStageData: data }, { merge: true });
}
