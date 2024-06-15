 const objectExample = JSON.stringify({
    text_segment: "###",
    start_time: "###",
    end_time:"###",
    words: "[###]",
    question: '##',
    answer: '##'
  })
  
export function snippetPrompt (questions, transcriptStr, wordsArray) {
   
  const prompt = 
  `Read the given questions: ${questions}. Determine what kind of questions they are (open-ended, true/false, fill in the blank).
  Generate JSON data with the following properties and no natural language response. Make sure the results are a stringified array of objects. Respond with only the data:
  {
    question:###,
    answer: ###,
    snippet: ###,
    start_array_idx: ###,
    start_word_idx: ###,
    end_array_idx: ###,
    end_word_idx: ###,
  }
  question: the given questions as a string.
  answer: The answer as a string.
  snippet: the segment of the transcript that answers the question. It should not include the question as a string.
  snip_begins.array_idx: The index of the transcript array that contains the starting word for the answer snippet as a string.
  snip_begins.start_word_idx: The position of the starting word within the array element as a string. 
  snip_ends.array_idx: The index of the transcript array that contains the ending word for the answer snippet as a string.
  snip_ends.end_word_idx: The position of the end word within the array elementas a string. 
  
  Here is the transcript array: ${wordsArray}`

  const prompt2 = 
  `Read the given questions: ${questions}. Determine what kind of questions they are (open-ended, true/false, fill in the blank).
  Generate JSON data with the following properties and no natural language response. Make sure the results are a stringified array of objects. Respond with only the data:
  {
    question:###,
    answer: ###,
    snippet: ###,
    start_word_idx: ###,
    end_word_idx: ###,
  }
  question: the given questions as a string.
  answer: The answer as a string.
  snippet: the segment of the transcript that answers the question. It should not include the question as a string.
  start_word_idx: The position of the first word of snippet. Use this array to find the index: ${wordsArray}. For example, if the snippet is: "I like cats.", the index should be for the word "I" because it's the first word of the snippet. 
  snip_ends.end_word_idx: The position of the ending word of snippet within this array: ${wordsArray}.  For example, if the snippet is: "I like cats.", the index should be for the word "cats because it is the last word of the snippet.". 
  
  Here is the transcript string: ${transcriptStr}`
    
  return prompt2;
}

export function makeQuestionsPrompt(searchQuery) {
  const prompt = `Make an array JS objects out of this text in {number: ##, question:## } format. Do not include the question number in the text of the question value: ${searchQuery}`
  return prompt
}

export function findTrueFalseQuestions(combinedTranscript) {
  const prompt = `Find some true false questions and a corresponding audio transcript below. Please return a JSON with the sections of the transcript that answer the true-false questions Here are the questions: 1 Connor has an important football match on Saturday.2 Connor is celebrating his birthday at an American restaurant.3 Olivia is not a fan of superhero films. 4 Connor invites Olivia to the museum. 5 Connor has about an hour between getting back from the museum and his piano lesson. 6 Connor isn't very busy the following weekend. Here is the transcript: ${combinedTranscript}`
  return prompt
}

export function findVocabularyPrompt(text, cefrLevel) {
  const prompt = `Find the most difficult words for a ${cefrLevel} ESL in this text: ${text}.
  Make an array of objects out using this format: { "word": "###", "vietnamese_translation": "###", "ipa_uk": "###", "ipa_usa": "###" }. 
  The ipd_uk field is the word written in the internation phoenetic alphabet for the UK.
  The ipd_usa field is the word written in the internation phoenetic alphabet for the USA.
  The most difficult words are the ones that are likely to be unfamiliar to a ${cefrLevel} ESL student.`
  return prompt
}