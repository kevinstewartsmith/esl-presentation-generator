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

// Build the scramble rounds from the comprehension items.
//
// MULTI-PASSAGE: a question can have several supporting passages, and each
// scramble-able passage is its OWN round (one slide per passage) — not one round
// per question. Rounds are emitted in item order, then passage order (which is
// chronological, since passages are sorted by transcript position upstream).
//
// options:
//   minWords   - passages shorter than this aren't worth unscrambling (default 3)
//   isSelected - optional (questionIndex, passageIndex) => boolean. When given,
//                only passages it returns true for become rounds (the scramble
//                slides pass this from scrambleConfig; the config card omits it to
//                show every passage).
//
// Each round:
//   { questionIndex, passageIndex, questionAnswer, passage, answer, scrambled,
//     wordCount, snippetFileName, indices }
export function buildScrambleRounds(comprehensionItems, options = {}) {
  const { minWords = 3, isSelected } = options;
  if (!Array.isArray(comprehensionItems)) return [];

  const rounds = [];

  comprehensionItems.forEach((item, questionIndex) => {
    const passages = Array.isArray(item?.passages) ? item.passages : [];

    passages.forEach((p, passageIndex) => {
      if (isSelected && !isSelected(questionIndex, passageIndex)) return;

      const { answer, scrambled, wordCount } = scramblePassage(p?.text ?? "");
      if (wordCount < minWords) return;

      rounds.push({
        questionIndex, // which comprehension item
        passageIndex, // which passage within that item
        questionAnswer: item?.answer ?? "", // the comprehension answer (header)
        passage: p?.text ?? "",
        answer, // original order, slash-joined (the unscramble solution)
        scrambled,
        wordCount,
        snippetFileName: p?.snippetFileName ?? null, // this passage's own clip
        indices: p?.indices ?? null,
      });
    });
  });

  return rounds;
}
