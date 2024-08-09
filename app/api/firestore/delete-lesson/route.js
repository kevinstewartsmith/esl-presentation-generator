import { db } from "@app/utils/firebaseAdmin";

//Delete from the firebase database
export const DELETE = async (request, { params }) => {
  console.log("Trying to DELETE");
  console.log(request.url);
  try {
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    await deleteSectionsDocuments(userID, lessonID);
    //await deleteSection(userID, lessonID);
    await deleteUserLesson(userID, lessonID);

    return new Response("Document successfully deleted!", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }

  async function deleteUserLesson(userID, lessonID) {
    const lessonRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID);
    await lessonRef.delete();
  }

  //Delete sections collection from the lesson
  async function deleteSectionsDocuments(userID, lessonID) {
    const sectionsRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections");
    const sections = await sectionsRef.get();
    sections.forEach((section) => {
      section.ref.delete();
    });
  }

  //Delete "Sections" collection from the lesson document
  async function deleteSection(userID, lessonID) {
    const sectionRef = db
      .collection("users")
      .doc(userID)
      .collection("lessons")
      .doc(lessonID)
      .collection("Sections");
    await sectionRef.delete();
  }
};
