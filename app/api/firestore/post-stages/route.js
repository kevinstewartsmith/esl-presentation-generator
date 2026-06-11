import { db } from "@app/utils/firebaseAdmin";

export const POST = async (request) => {
  try {
    console.log("POST Lesson Stages");
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");
    const lessonID = url.searchParams.get("lessonID");
    const stages = url.searchParams.get("stages");

    if (!userID || !lessonID || !stages) {
      return new Response(
        JSON.stringify({ error: "Missing userID, lessonID, or stages" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let parsedStages;
    try {
      parsedStages = JSON.parse(stages);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid stages JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const includedStages = parsedStages.root;
    const unincludedStages = parsedStages.container1;

    if (!Array.isArray(includedStages) || !Array.isArray(unincludedStages)) {
      return new Response(
        JSON.stringify({
          error: "stages must contain root and container1 arrays",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // SAFETY: never overwrite a lesson with totally empty stages.
    if (includedStages.length === 0 && unincludedStages.length === 0) {
      console.warn(
        `Refusing to write empty stages to lesson ${lessonID} (safety guard).`,
      );
      return new Response(
        JSON.stringify({ skipped: true, reason: "empty stages not written" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    await Promise.all(
      includedStages.map((stage) =>
        postSectionsToLesson(userID, lessonID, stage),
      ),
    );

    await postStageOrderToLesson(userID, lessonID, includedStages);
    await postUnincludedStageOrderToLesson(userID, lessonID, unincludedStages);

    return new Response("Lesson Stages posted successfully.", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

async function postSectionsToLesson(userId, lessonId, sectionId) {
  const sectionRef = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId)
    .collection("Sections")
    .doc(sectionId);

  const sectionDoc = await sectionRef.get();

  if (!sectionDoc.exists) {
    await sectionRef.set({ name: sectionId });
    console.log(`Section ${sectionId} added to lesson ${lessonId}.`);
  } else {
    console.log(`Section ${sectionId} already exists in lesson ${lessonId}.`);
  }
}

async function postStageOrderToLesson(userId, lessonId, stageOrder) {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId);
  console.log("POSTING STAGE ORDER");
  await ref.set({ stageOrder: stageOrder }, { merge: true });
  console.log(`Stage Order added to lesson ${lessonId}.`);
}

async function postUnincludedStageOrderToLesson(
  userId,
  lessonId,
  unincludedStageOrder,
) {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("lessons")
    .doc(lessonId);
  console.log("POSTING UNINCLUDED STAGE ORDER");
  await ref.set(
    { unincludedStageOrder: unincludedStageOrder },
    { merge: true },
  );
  console.log(`Unincluded Stage Order added to lesson ${lessonId}.`);
}
