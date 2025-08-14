import { saveFile } from "@app/utils/IndexedDBWrapper";
import { Category } from "@node_modules/@mui/icons-material";

export const saveImageToIndexedDB = async (filePath, file) => {
  const reader = new FileReader();
  reader.onload = async () => {
    const base64Image = reader.result;
    await saveFile(filePath, base64Image);
  };
  reader.readAsDataURL(file);
};

//Drag and Drop Text
export function dragNDropText(category) {
  switch (category) {
    case "BookText":
      return "Book Text";
    case "QuestionText":
      return "QUESTION Text";
    case "AnswerText":
      return "ANSWER Text";
    case "ListeningQuestionText":
      return "Audio QUESTIONS";
    case "ListeningAnswersText":
      return "Audio ANSWERS";
    case "ListeningTranscript":
      return "Audio TRANSCRIPT";
    default:
      return "No category selected";
  }
}

// API upload logic (CURRENTLY NOT IN USE)
export async function uploadImageToApi({ userID, lessonId, stageID, file }) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64Image = reader.result;
      const response = await fetch("/api/firestore/post-text-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userID,
          lessonId,
          lessonStage: stageID,
          image: base64Image,
          imageName: file.name,
        }),
      });
      resolve(response);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Send audio file to Firestore
const uploadAudioToApi = async (file) => {
  // Convert file to base64
  const reader = new FileReader();
  reader.onload = async () => {
    const base64Image = reader.result;
    // Send POST request to your API
    await fetch("/api/firestore/post-text-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userID, // Replace with actual username
        lessonId: lessonId, // Replace with actual lessonId
        lessonStage: stageID,
        image: base64Image,
        imageName: file.name,
      }),
    });
  };
  reader.readAsDataURL(file);
};
