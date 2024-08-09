import { db } from "@app/utils/firebaseAdmin";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import { getData, getAllInputData } from "@app/utils/FirestoreGetMethods";
export const GET = async (request) => {
  console.log("trying to GET");
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userID");
    const lessonId = url.searchParams.get("lessonID");
    const getMethod = url.searchParams.get("method");
    const collectionName = "users";
    console.log("Search Params: ", userId, lessonId, getMethod);

    // if (getMethod === "getOneLesson") {
    //   const data = await getData(getMethod, userId, lessonId);
    //   return new Response(JSON.stringify(data), {
    //     status: 200,
    //   });
    // }

    let data = null;
    switch (getMethod) {
      case "getOneLesson":
        data = await getData(getMethod, userId, lessonId);
        return new Response(JSON.stringify(data), {
          status: 200,
        });
      case "getAllLessons":
        console.log("Getting all lessons SERVER");
        data = await getData(getMethod, userId);
        return new Response(JSON.stringify(data), {
          status: 200,
        });
      case "getAllInputs":
        console.log("Getting all inputs SERVER");
        data = await getAllInputData(getMethod, userId, lessonId);
        return new Response(JSON.stringify(data), {
          status: 200,
        });
      default:
        return new Response("Invalid method", { status: 400 });
    }

    // return new Response(JSON.stringify(data), {
    //   status: 200,
    // });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }
};
