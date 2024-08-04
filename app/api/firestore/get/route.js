import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  console.log("trying to GET");
  try {
    const collectionName = "users";

    // Get a reference to the collection
    const collectionRef = db.collection(collectionName);

    const sfRef = db.collection("cities");
    const documents = await sfRef.listDocuments();
    documents.forEach((document) => {
      console.log("Found subcollection with id:", document.data());
    });

    // const snapshot = await db.collection("users").get();
    // snapshot.forEach((doc) => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    return new Response(JSON.stringify(documents), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }
};
