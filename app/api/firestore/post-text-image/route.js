//Uses username, lessonId, lesson stage to post an image to firebase storage
import { db } from "@/app/utils/firebaseAdmin";

export const POST = async (request) => {
  console.log("Posting image to Firebase Storage");

  const { username, lessonId, lessonStage, image } = await request.json();

  if (!username || !lessonId || !lessonStage || !image) {
    console.error("Missing required fields");
    console.log("userID: ", username);
    console.log("Lesson ID: ", lessonId);
    console.log("Lesson Stage: ", lessonStage);
    //console.log("Image: ", image);

    return new Response("Missing required fields", { status: 400 });
  }
  //log all the data
  console.log("User ID: ", username);
  console.log("Lesson ID: ", lessonId);
  console.log("Lesson Stage: ", lessonStage);
  //console.log("Image: ", image);

  try {
    const imageRef = db
      .collection("users")
      .doc(username)
      .collection("lessons")
      .doc(lessonId)
      .collection("stages")
      .doc(lessonStage)
      .collection("images")
      .doc();
    await imageRef.set({ image });
    return new Response("Image posted successfully", { status: 200 });
  } catch (error) {
    console.error("Error posting image:", error);
    return new Response("Error posting image", { status: 500 });
  }
};
