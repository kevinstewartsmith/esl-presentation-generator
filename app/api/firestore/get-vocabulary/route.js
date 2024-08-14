import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  try {
    console.log("Trying to GET Lesson VOCABULARY");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");
    console.log("userID: ", userID);
    console.log("lessonID: ", lessonID);
    console.log("stageID: ", stageID);
    //const decodedStageID = decodeURIComponent(stageID);
    const response = await getVocabulary(
      userID,
      lessonID,
      "Reading For Gist and Detail"
    );

    //const data = await response.vocabulary;
    console.log("About to send response");

    console.log(response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error getting vocabulary.", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

async function getVocabulary(userID, lessonID, stageID) {
  const vocabularyRef = db
    .collection("users")
    .doc(userID)
    .collection("lessons")
    .doc(lessonID)
    .collection("Sections")
    .doc(stageID)
    .collection("Vocabulary")
    .doc("vocabulary");

  const vocabularySnapshot = await vocabularyRef.get();
  //   const vocabulary = vocabularySnapshot.docs.vocabulary.map((doc) => ({
  //     //id: doc.id, // Include the document ID
  //     ...doc.data(), // Include the document fields
  //   }));
  console.log("VOCABULARY");
  //console.log(vocabulary);
  const vocabularyArray = vocabularySnapshot.data();
  //console.log(vocabularyArray.vocabulary);
  const vocabulary = vocabularyArray.vocabulary;
  return vocabulary;
}
