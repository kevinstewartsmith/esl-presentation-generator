import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to GET Lesson Stages");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const response = await getStageOrder(userID, lessonID);
    console.log("STAGE ORDER");
    //console.log(response.json());

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

async function getStageOrder(userID, lessonID) {
  // get field stageOrder from lesson document
  const lessonRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID);
  const lessonDoc = await lessonRef.get();
  const lessonData = lessonDoc.data();
  console.log("Lesson Data");

  console.log(lessonData);

  const stageOrder = lessonData.stageOrder;
  const unIncludedStages = lessonData.unincludedStageOrder;
  const stageOrderObj = {
    root: stageOrder,
    container1: unIncludedStages,
  };
  console.log(stageOrder);
  return stageOrderObj;
}
