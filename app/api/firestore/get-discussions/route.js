import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  console.log("SERVER: GET discussions");
  try {
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");

    console.log("userID: ", userID);
    console.log("lessonID: ", lessonID);
    console.log("stageID: ", stageID);

    const sectionsRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections")
      .doc(stageID)
      .collection("inputs")
      .doc("discussionInputs");

    const doc = await sectionsRef.get();
    const discussions = doc.data();
    console.log("DISCUSSIONS from FIRESTORE:");
    console.log(discussions);

    return new Response(JSON.stringify(discussions), { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error reading document", { status: 500 });
  }
};
