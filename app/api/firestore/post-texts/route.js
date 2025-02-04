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
    const textType = url.searchParams.get("textType");

    const decodedData = decodeURIComponent(data);

    console.log(`userID: ${userID}`);
    console.log(`lessonID: ${lessonID}`);
    console.log(`stageID: ${stageID}`);
    console.log(`data: ${data}`);
    console.log(`textType: ${textType}`);

    const parsedData = JSON.parse(data);

    const textData = {
      transcript: data,
      textEdits: ["", ""],
    };
    //const textData = data;
    //postTextsToSection(userID, lessonID, "testsection", "testtext");
    postTextsToSection(userID, lessonID, stageID, parsedData, textType);

    // return new Response("Lesson Stages posted successfully.", {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    return new Response(
      JSON.stringify({ message: "Data saved successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Invalid JSON data" }), {
      status: 400,
    });
    //return error;
  }
};

async function postTextsToSection(
  userId,
  lessonId,
  sectionId,
  texts,
  textType
) {
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
    switch (textType) {
      case "BookText":
        await sectionRef.set({ texts: texts }, { merge: true });
        console.log(
          `Transcript added to section ${sectionId} in lesson ${lessonId}.`
        );
        break;
      case "QuestionText":
        await sectionRef.set({ questions: texts }, { merge: true });
        console.log(
          `Questions added to section ${sectionId} in lesson ${lessonId}.`
        );
        break;
      case "AnswerText":
        await sectionRef.set({ answers: texts }, { merge: true });
        console.log(
          `Answers added to section ${sectionId} in lesson ${lessonId}.`
        );
        break;
      case "AudioQuestionText":
        await sectionRef.set({ audioQuestions: texts }, { merge: true });
        console.log(
          `Audio Questions added to section ${sectionId} in lesson ${lessonId}.`
        );
        break;
      case "AudioTranscript":
        await sectionRef.set({ transcript: texts }, { merge: true });
        console.log(
          `Audio Transcript added to section ${sectionId} in lesson ${lessonId}.`
        );
        break;
      default:
        console.log(`Text type ${textType} not recognized.`);
    }
    //await sectionRef.set({ texts: texts }, { merge: true });
    console.log(`Texts added to section ${sectionId} in lesson ${lessonId}.`);
  }
}
