import { db } from "@app/utils/firebaseAdmin";

// Maps a textType to the Firestore field it writes.
// Adding a new saveable text field = one line here. No switch, no new route.
const FIELD_MAP = {
  BookText: "texts",
  QuestionText: "questions",
  AnswerText: "answers",
  AudioQuestionText: "audioQuestions",
  AudioTranscript: "transcript",
  AudioFileName: "audioFileName",
  S2tTranscript: "s2tTranscript",
  WordTimeArray: "wordTimeArray",
  OcrTranscript: "audioTranscript",
  AudioQuestions: "audioQuestions",
  AudioAnswers: "audioAnswers",
  ComprehensionItems: "comprehensionItems",
  ImagePaths: "imagePathsByCategory",
};

export const POST = async (request) => {
  try {
    const { userID, lessonID, stageID, textType, data } = await request.json();

    if (!userID || !lessonID || !stageID) {
      return Response.json(
        { error: "Missing userID, lessonID, or stageID" },
        { status: 400 },
      );
    }

    const field = FIELD_MAP[textType];
    if (!field) {
      return Response.json(
        { error: `Unknown textType: ${textType}` },
        { status: 400 },
      );
    }

    const sectionRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections")
      .doc(stageID);

    // Single write that works whether or not the section exists yet.
    await sectionRef.set({ name: stageID, [field]: data }, { merge: true });

    return Response.json({ message: "Saved", field });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Save failed" }, { status: 500 });
  }
};
