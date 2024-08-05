import { db } from "@app/utils/firebaseAdmin";

export const DELETE = async (request, { params }) => {
  console.log("Trying to DELETE");
  console.log(request.url);
  try {
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");

    await deleteUserLesson(userID, lessonID);

    return new Response("Document successfully deleted!", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }

  async function deleteUserLesson(userID, lessonID) {
    const lessonRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID);
    await lessonRef.delete();
  }
};
