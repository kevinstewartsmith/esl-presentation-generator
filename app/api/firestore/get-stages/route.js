import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to GET Lesson Stages");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const response = getLessonStages(userID, lessonID);

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

async function getLessonStages(userID, lessonID) {
  const stagesRef = db
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
