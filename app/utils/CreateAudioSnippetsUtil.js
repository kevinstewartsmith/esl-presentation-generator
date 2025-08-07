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
    findPassageIndices(passage, wordObjectsArray)
  );
}

function findPassageIndices(passage, wordObjectsArray) {
  const wordsArray = wordObjectsArray.map((obj) => normalizeWord(obj.word));
  const passageWords = passage.trim().split(/\s+/).map(normalizeWord);
  const passageLength = passageWords.length;

  for (let i = 0; i <= wordsArray.length - passageLength; i++) {
    const window = wordsArray.slice(i, i + passageLength);
    if (window.join(" ") === passageWords.join(" ")) {
      return { start: i, end: i + passageLength - 1 };
    }
  }

  function normalizeWord(word) {
    return word.toLowerCase().replace(/[’'‘”“"!?.,;:()]/g, ""); // remove punctuation, support smart quotes too
  }

  return null;
}
