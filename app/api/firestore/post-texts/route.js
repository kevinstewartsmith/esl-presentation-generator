import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    console.log("POST Texts, questions, or answers to a section");
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

    const textData = {
      transcript: data,
      textEdits: ["shit", "fart"],
    };

    //postTextsToSection(userID, lessonID, "testsection", "testtext");
    postTextsToSection(userID, lessonID, stageID, textData);

    return new Response("Lesson Stages posted successfully.", {
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

async function postTextsToSection(userId, lessonId, sectionId, texts) {
  const sectionRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections")
    .doc(sectionId); // Use sectionId as the document ID

  const sectionDoc = await sectionRef.get();

  // Check if the section already exists
  if (!sectionDoc.exists) {
    // Add the new section with the name
    await sectionRef.set({ name: sectionId }, { merge: true });
    console.log(
      `Section ${sectionId} with name "${sectionId}" added to lesson ${lessonId}.`
    );
  } else {
    console.log(`Section ${sectionId} already exists in lesson ${lessonId}.`);

    // Add the new text to the section
    await sectionRef.set({ texts: texts }, { merge: true });
    console.log(`Texts added to section ${sectionId} in lesson ${lessonId}.`);
  }
}
