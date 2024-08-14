import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to GET Textbook Data");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");
    const response = await getTextbookData(userID, lessonID, stageID);

    console.log(response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

async function getTextbookData(userID, lessonID, stageID) {
  const sectionRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc(stageID);

  const sectionDoc = await sectionRef.get();
  //get all data and put it in an object

  if (!sectionDoc.exists) {
    return new Response("Section does not exist.", { status: 404 });
  }

  const sectionData = sectionDoc.data();
  console.log("Section Data");

  console.log(sectionData.texts);

  return sectionData;
}
