import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  const url = new URL(request.url);
  const userID = url.searchParams.get("userID");
  const lessonID = url.searchParams.get("lessonID");
  const data = url.searchParams.get("data");
  const stageIDC = url.searchParams.get("stageID");

  console.log("Stage ID-----C: ", stageIDC);

  const stageID = "Reading For Gist and Detail";
  // decode stageID
  //const decodedStageID = decodeURIComponent(stageID);
  console.log("SERVER: GET Included Data");
  //console.log("Data: ", data);
  console.log("userID: ", userID);
  console.log("lessonID: ", lessonID);
  console.log("stageID: ", stageID);

  try {
    //const includedData = JSON.parse(data);
    const sectionsRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections")
      .doc(stageID)
      .collection("inputs")
      .doc("includedInputs");

    // get all the data from the includedInputs document
    const includedInputs = await sectionsRef.get();
    //map over the all of the fields and put them into an object
    const includedInputsData = includedInputs.data();
    console.log("Included Inputs Data: ");
    console.log(includedInputsData);

    //map over the includedInputsData object and return the data

    return new Response(JSON.stringify(includedInputsData), {
      status: 200,
    });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};
