import { db } from "@app/utils/firebaseAdmin";

export const POST = async () => {
  console.log("Trying to POST");

  try {
    // Example document write operation
    const citiesRef = db.collection("cities");
    await citiesRef.doc("SF").set({
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
    });

    return new Response("Document successfully written!", { status: 200 });
  } catch (e) {
    console.error("ERROR: " + e);
    return new Response("Error writing document", { status: 500 });
  }
};
