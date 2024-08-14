import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    console.log("POST vocabulary to SERVER");
    //userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${textbook}
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stageID = url.searchParams.get("stageID");
    const data = url.searchParams.get("data");

    console.log(`userID: ${userID}`);
    console.log(`lessonID: ${lessonID}`);
    console.log(`stageID: ${stageID}`);
    console.log(`data: ${data}`);

    const parsedVocabulary = JSON.parse(data);

    const response = await postVocabularyToSection(
      userID,
      lessonID,
      stageID,
      parsedVocabulary
    );

    return new Response("Vocabulary posted successfully.", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error posting vocabulary.", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

async function postVocabularyToSection(
  userId,
  lessonId,
  sectionId,
  vocabulary
) {
  const sectionRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections")
    .doc(sectionId)
    .collection("Vocabulary")
    .doc("vocabulary");

  const sectionDoc = await sectionRef.get();

  // Check if the section already exists
  //   if (!sectionDoc.exists) {
  //     // Add the new section with the name
  //     await sectionRef.set({ name: sectionId }, { merge: true });
  //     console.log("Section does not exist. Created new section.");
  //   } else {
  //     console.log("Section already exists.");
  //   }

  // Add the new vocabulary to the section
  await sectionRef.set({ vocabulary: vocabulary }, { merge: true });
}
