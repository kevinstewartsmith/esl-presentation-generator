import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  const url = new URL(request.url);
  const userID = url.searchParams.get("userID");
  const lessonID = url.searchParams.get("lessonID");
  const data = url.searchParams.get("data");
  const stageID = url.searchParams.get("stageID");
  console.log("SERVER: POST discussions");
  console.log("Data: ", data);
  console.log("userID: ", userID);
  console.log("lessonID: ", lessonID);
  console.log("stageID: ", stageID);

  try {
    // const discussion = {
    //   discussion: {
    //     nestedKey1: "param add discussion",
    //   },
    // };
    const discussion = JSON.parse(data);
    const sectionsRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections")
      .doc(stageID)
      .collection("inputs")
      .doc("discussionInputs");

    await sectionsRef.set(discussion);

    return new Response("Discussion successfully added!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};
