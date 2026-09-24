// scrambleConfigHelpers.js
// Reader for scrambleConfig so the "absent = included" convention lives in ONE
// place (used by the ScrambleCard and scrambleSlideModel alike) — mirrors
// detailConfigHelpers.getQuestionFlags.
//
// Selection is per (questionIndex, passageIndex): every scramble-able passage
// defaults to INCLUDED until the teacher unticks it.

export function getScramblePassageFlag(scrambleConfig, questionIndex, passageIndex) {
  const include =
    scrambleConfig?.perPassage?.[questionIndex]?.[passageIndex]?.include;
  return { include: include ?? true };
}
