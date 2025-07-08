import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to GET Think - Pair - Share Data");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");

    console.log("Think - Pair - Share Data Request Parameters:");

    console.log(`url: ${url}`);
    console.log(`userID: ${userID}`);
    console.log(`lessonID: ${lessonID}`);
    console.log(`stageID: ${stageID}`);
    const response = await getThinkPairShareData(userID, lessonID, stageID);

    console.log("Think - Pair - Share Data Response:");
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

async function getThinkPairShareData(userID, lessonID, stageID) {
  const sectionRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc("Think - Pair - Share")
    .collection("ThinkPairShare")
    .doc("thinkPairShare");
  //.doc("ThinkPhase"); // Assuming you want to get the ThinkPhase document

  const sectionDoc = await sectionRef.get();
  //get all data and put it in an object

  if (!sectionDoc.exists) {
    return new Response("Section does not exist.", { status: 404 });
  }

  const sectionData = sectionDoc.data();
  console.log("THINK PAIR SHARE  Section Data");

  console.log(sectionData);

  return sectionData;
}
