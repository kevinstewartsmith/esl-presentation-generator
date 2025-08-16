import { listeningForGistandDetailStage } from "./SectionIDs";

export const getCompleteListeningStageDataFromDB = async (
  currentUserID,
  currentLessonID
) => {
  const encodedStageID = encodeURIComponent(listeningForGistandDetailStage);
  const response = await fetch(
    `/api/firestore/section-data/get-section-data?userID=${currentUserID}&lessonID=${currentLessonID}&stageID=${encodedStageID}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch complete listening stage data");
  }
  const data = await response.json();
  console.log("Listening Data:", data);
  return data;
};
