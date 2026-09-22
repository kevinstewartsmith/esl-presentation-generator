export const mergeItems = (itemA, itemB) => {
  return itemA.map((a) => {
    const match = itemB.find((b) => b.number === a.number);
    return {
      ...a,
      ...match, // adds fields from itemB if match is found
    };
  });
};

// Attach the ranked passage list to each question, from the new passage route's
// output: { results: [{ number, passages: ["text", ...] }, ...] }.
//
// Each passage starts as an object { text }; `indices` and `snippetFileName`
// are filled in by the later stages below. Matched by question NUMBER (not
// array index) so it's robust to ordering.
export const addPassagesToQuestions = (questionsAndAnswers, results) => {
  return questionsAndAnswers.map((qa) => {
    const match = results.find((r) => r.number === qa.number);
    const texts = Array.isArray(match?.passages) ? match.passages : [];
    return {
      ...qa,
      passages: texts.map((text) => ({ text })),
    };
  });
};

// Attach an AI-generated `explanation` (why the answer is correct) to each
// question, from the explanation route's output:
// { results: [{ number, explanation }, ...] }. Matched by question NUMBER.
// A question with no result, or an empty explanation, keeps explanation "".
export const addExplanationsToQuestions = (questionsAndAnswers, results) => {
  return questionsAndAnswers.map((qa) => {
    const match = results.find((r) => r.number === qa.number);
    return {
      ...qa,
      explanation: typeof match?.explanation === "string"
        ? match.explanation
        : "",
    };
  });
};

// Resolve each passage's word-index range against the transcript word array.
// Adds `indices` ({ start, end } or null) to every passage on every question,
// then reorders the passages into CHRONOLOGICAL (spoken) order.
//
// Selection vs. order: the AI route picks WHICH passages matter (capped at
// MAX_PASSAGES, using importance to choose the best ones). But a student should
// hear them in the order they occur in the audio, not in importance order — so
// once we know each passage's position (indices.start), we sort by it here.
// Passages we couldn't locate (null indices) sort last; they have no clip anyway.
//
// This runs BEFORE the splitter, so clips are cut in this same chronological
// order and the _i_j filenames line up with spoken order automatically.
export const addIndicesToPassages = (questionsAndAnswers, wordObjectsArray) => {
  return questionsAndAnswers.map((qa) => {
    const withIndices = (qa.passages ?? []).map((p) => ({
      ...p,
      indices: findPassageIndices(p.text, wordObjectsArray),
    }));

    withIndices.sort((a, b) => {
      if (!a.indices) return 1; // a unlocatable → after b
      if (!b.indices) return -1; // b unlocatable → after a
      return a.indices.start - b.indices.start; // earlier in transcript first
    });

    return { ...qa, passages: withIndices };
  });
};

function normalizeWord(word) {
  return (word ?? "").toLowerCase().replace(/['''"""!?.,;:()\-]/g, ""); // strip punctuation incl. hyphens + smart quotes
}

// EXACT contiguous match first (fast, precise); if that fails — usually because
// the AI passage tokenizes differently from the word array — fall back to a
// FUZZY best-window search accepted only above a threshold, so we rescue real
// passages without clipping unrelated audio.
function findPassageIndices(passage, wordObjectsArray) {
  const wordsArray = wordObjectsArray.map((obj) => normalizeWord(obj.word));
  const passageWords = (passage ?? "")
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

  const FUZZY_THRESHOLD = 0.6; // ≥60% of words line up
  if (bestStart !== -1 && bestScore >= FUZZY_THRESHOLD) {
    return { start: bestStart, end: bestStart + passageLength - 1 };
  }

  return null;
}

// After clips are cut, attach each clip's filename to its passage.
// `clipsByQuestion` is aligned to questions; clipsByQuestion[i] is an array of
// filenames aligned to that question's passages (same order).
export const addSnippetsFileNamesToQuestions = (
  questionsAndAnswers,
  clipsByQuestion,
) => {
  return questionsAndAnswers.map((qa, i) => ({
    ...qa,
    passages: (qa.passages ?? []).map((p, j) => ({
      ...p,
      snippetFileName: clipsByQuestion[i]?.[j] ?? null,
    })),
  }));
};
