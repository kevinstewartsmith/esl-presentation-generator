export async function postToApiSectionData(
  userID,
  lessonID,
  stageID,
  keyName,
  data,
  successMessage
) {
  if (!userID || !lessonID) {
    console.log("⛔ Missing values for autosave");
    return;
  }

  const url = `/api/firestore/section-data/post-section-data`;
  const body = { userID, lessonID, stageID, keyName, data };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (successMessage) {
      console.log(successMessage, result);
    }
    return result;
  } catch (error) {
    console.error("Error posting to API:", error);
    throw error;
  }
}
