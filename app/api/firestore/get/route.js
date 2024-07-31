import { db } from "@app/utils/firebaseAdmin";

export const GET = async (request) => {
  console.log("trying to GET");
  try {
    const collectionName = "cities";

    // Get a reference to the collection
    const collectionRef = db.collection(collectionName);

    // Fetch all documents in the collection
    const snapshot = await collectionRef.get();

    // Extract document data
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(typeof documents[0].city_name);
    return new Response(documents[0].city_name + " " + documents[1].city_name, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("damn", { status: 500 });
  }
};
