import { db } from "@app/utils/firebaseAdmin";

export const POST = async () => {
  console.log("Trying to POST");

  try {
    // Example document write operation
    const citiesRef = db.collection("users");
    await citiesRef.doc("kevinstewartsmith").set({
      firstName: "Kevin",
      lastName: "Smith",
      userId: "kevinstewartsmith",
      country: "USA",
      lessons: [],
    });

    return new Response("Document successfully written!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};
