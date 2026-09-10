export const mergeItems = (itemA, itemB) => {
  return itemA.map((a) => {
    const match = itemB.find((b) => b.number === a.number);
    return {
      ...a,
      ...match, // adds fields from itemB if match is found
    };
  });
};

export const addPassagesToQuestions = (questionsAndAnswers, passages) => {
  return questionsAndAnswers.map((qa, index) => ({
    ...qa,
    passage: passages[index] ?? "", // fallback to "" if undefined
  }));
};

export function findBatchPassageIndices(passagesArray, wordObjectsArray) {
  return passagesArray.map((passage) =>
    findPassageIndices(passage, wordObjectsArray),
  );
}

// Replace the existing findPassageIndices (and its inner normalizeWord) in
// app/utils/CreateAudioSnippetsUtil.js with the version below.
//
// STRATEGY: try an EXACT contiguous match first (fast, precise). If that fails
// — usually because the AI-generated passage tokenizes differently from the
// word array (numbers, hyphens, contractions, transcription variants) — fall
// back to a FUZZY best-window search: slide the same-length window and score it
// by how many words match, accepting the best window only if it clears a
// threshold. This rescues passages that exist but don't match character-for-
// character, without matching unrelated audio.

function normalizeWord(word) {
  return (word ?? "").toLowerCase().replace(/[’'‘”“"!?.,;:()\-]/g, ""); // strip punctuation incl. hyphens + smart quotes
}

function findPassageIndices(passage, wordObjectsArray) {
  const wordsArray = wordObjectsArray.map((obj) => normalizeWord(obj.word));
  const passageWords = passage
    .trim()
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
  const passageLength = passageWords.length;

  if (passageLength === 0 || wordsArray.length < passageLength) return null;

  // ---- 1. EXACT contiguous match ----
  const target = passageWords.join(" ");
  for (let i = 0; i <= wordsArray.length - passageLength; i++) {
    const window = wordsArray.slice(i, i + passageLength).join(" ");
    if (window === target) {
      return { start: i, end: i + passageLength - 1 };
    }
  }

  // ---- 2. FUZZY fallback: best-scoring same-length window ----
  // Score = fraction of positions where the window word equals the passage word.
  let bestScore = 0;
  let bestStart = -1;
  for (let i = 0; i <= wordsArray.length - passageLength; i++) {
    let matches = 0;
    for (let j = 0; j < passageLength; j++) {
      if (wordsArray[i + j] === passageWords[j]) matches++;
    }
    const score = matches / passageLength;
    if (score > bestScore) {
      bestScore = score;
      bestStart = i;
    }
  }

  // Accept only a confident-enough match so we don't clip unrelated audio.
  const FUZZY_THRESHOLD = 0.6; // ≥60% of words line up
  if (bestStart !== -1 && bestScore >= FUZZY_THRESHOLD) {
    return { start: bestStart, end: bestStart + passageLength - 1 };
  }

  return null;
}

export const addSnippetsFileNamesToQuestions = (
  questionsAndAnswers,
  snippetFileNames,
) => {
  return questionsAndAnswers.map((qa, index) => ({
    ...qa,
    snippetFileNames: snippetFileNames[index] || [],
  }));
};
