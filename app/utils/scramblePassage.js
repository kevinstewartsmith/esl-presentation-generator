// scramblePassage.js
// Turns a passage (the exact transcript span for a comprehension item) into a
// word-scramble for the decode/unscramble game.
//
// Rules:
//  - Split on whitespace into words.
//  - Punctuation stays attached to its word ("blind." is one token). This only
//    matters for book-uploaded transcripts; Google-transcribed text has none.
//  - Capitalization is preserved exactly as written.
//  - Words are displayed joined by " / ".
//  - The scrambled order is guaranteed to differ from the original (re-shuffles
//    if a shuffle happens to land on the original order).
//
// Returns: { answer, scrambled, wordCount }
//   answer    -> original order, slash-joined  ("I / met / someone")
//   scrambled -> shuffled order, slash-joined  ("someone / I / met")
//   wordCount -> number of words (useful for filtering trivial passages)

export function scramblePassage(passage) {
  const words = (passage ?? "").trim().split(/\s+/).filter(Boolean);

  const answer = words.join(" / ");

  // 0 or 1 word: nothing to scramble.
  if (words.length <= 1) {
    return { answer, scrambled: answer, wordCount: words.length };
  }

  // Fisher-Yates shuffle, re-rolled if it matches the original so students are
  // never accidentally shown the answer. Cap attempts to avoid an infinite loop
  // on degenerate inputs (e.g. all-identical words).
  let shuffled;
  let attempts = 0;
  do {
    shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (shuffled.join(" ") === words.join(" ") && attempts < 10);

  return {
    answer,
    scrambled: shuffled.join(" / "),
    wordCount: words.length,
  };
}

// Convenience: given the comprehension items (each with a `.passage`), build the
// list of scramble rounds for the game, skipping passages too short to be worth
// unscrambling. `minWords` defaults to 3 (a 1-2 word scramble is trivial).
export function buildScrambleRounds(comprehensionItems, minWords = 3) {
  if (!Array.isArray(comprehensionItems)) return [];

  return comprehensionItems
    .map((item, index) => {
      const passage = item?.passage ?? "";
      const { answer, scrambled, wordCount } = scramblePassage(passage);
      return {
        index, // which comprehension item this came from
        passage,
        answer,
        scrambled,
        wordCount,
        snippetFileNames: item?.snippetFileNames ?? [], // audio for the play button
      };
    })
    .filter((round) => round.wordCount >= minWords);
}
