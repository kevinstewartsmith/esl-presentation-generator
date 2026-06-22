import { listeningForGistandDetailStage } from "./SectionIDs";
import { readingForGistandDetailStage } from "./SectionIDs";

// Shared helper: build URL, fetch, safe-parse, return null on any failure.
async function fetchStageData(endpoint, params) {
  const query = new URLSearchParams(params).toString();
  const url = `/api/firestore/${endpoint}?${query}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getCompleteListeningStageDataFromDB = (
  currentUserID,
  currentLessonID,
) =>
  fetchStageData("section-data/get-section-data", {
    userID: currentUserID,
    lessonID: currentLessonID,
    stageID: listeningForGistandDetailStage,
  });

export const getReadingTextDataFromDB = (currentUserID, currentLessonID) =>
  fetchStageData("get-textbook-data", {
    userID: currentUserID,
    lessonID: currentLessonID,
    stageID: "Reading For Gist and Detail",
  });
