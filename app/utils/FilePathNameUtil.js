export const addFilePath = (fileName, userID, lessonID, stageID) => {
  return `${userID}/${lessonID}/${stageID}/${fileName}`;
};

// Returns only the file name from a path string
export const takeAwayFilePath = (filePath) => {
  return filePath.split("/").pop();
};
