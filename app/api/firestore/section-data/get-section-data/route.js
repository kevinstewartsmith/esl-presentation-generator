import { db } from "@app/utils/firebaseAdmin";
import { replacePlaceholderWithEmpty } from "@app/utils/replacePlaceholderWithEmpty";
export const GET = async (request) => {
  console.log("Trying to GET Section Data");
  try {
    const url = new URL(request.url);
    //url params
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");

    const docRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections")
      .doc(stageID);

    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response("Section not found", { status: 404 });
    }

    const data = doc.data();
    const cleanData = replacePlaceholderWithEmpty(data);

    return new Response(JSON.stringify(cleanData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching section data", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
