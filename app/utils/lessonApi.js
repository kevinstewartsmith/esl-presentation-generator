export async function loadLessons(userID, method, lessonID) {
  if (method === "getAllLessons") {
    return fetch(
      `/api/firestore/get-lessons?userID=${userID}&method=${method}`,
    );
  } else if (method === "getOneLesson") {
    return fetch(
      `/api/firestore/get-lessons?userID=${userID}&method=${method}&lessonID=${lessonID}`,
    );
  }
}

export async function addNewLesson(userID, title) {
  const res = await fetch(
    `/api/firestore/post-lessons?userID=${userID}&lessonTitle=${encodeURIComponent(title)}`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error("Failed to create lesson");
  return res.json(); // → { id: "<real firestore id>" }
}

export async function deleteLessonFromDB(userID, lessonID) {
  const res = await fetch(
    `/api/firestore/delete-lesson?userID=${userID}&lessonID=${lessonID}`,
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error("Failed to delete lesson");
  return res.json();
}
