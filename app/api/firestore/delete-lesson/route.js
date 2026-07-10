import { db } from "@app/utils/firebaseAdmin";

export const DELETE = async (request) => {
  try {
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");

    if (!userID || !lessonID) {
      return Response.json(
        { error: "Missing userID or lessonID" },
        { status: 400 },
      );
    }

    const lessonRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID);

    // Firestore does NOT cascade-delete subcollections when a document is deleted.
    // recursiveDelete removes the lesson doc AND every nested subcollection at any
    // depth (Sections → inputs/Vocabulary/ThinkPairShare, stages → images),
    // batched and rate-limited by the Admin SDK.
    await db.recursiveDelete(lessonRef);

    return Response.json({ message: "Lesson deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
};
