import React, { useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useLessonStore } from "@app/stores/UseLessonStore";
//import { parse } from "@node_modules/next/dist/build/swc/generated-native";

const CreateAudioSnippets = () => {
  //audioQuestions
  const [readyForSnippets, setReadyForSnippets] = useState(false);
  const [readyForWordTimeData, setReadyForWordTimeData] = useState(false);
  const wordTimeArray = useLessonStore((state) => state.wordTimeArray);
  const updateWordTimeArray = useLessonStore(
    (state) => state.updateWordTimeArray
  );
  const audioQuestions = useLessonStore((state) => state.audioQuestions);
  const audioAnswers = useLessonStore((state) => state.audioAnswers);
  const [audioQuestionObj, setAudioQuestionObj] = useState([]);
  const [audioAnswerObj, setAudioAnswerObj] = useState([]);
  const updateCompleteListeningStageData = useLessonStore(
    (state) => state.updateCompleteListeningStageData
  );
  const completeListeningStageData = useLessonStore(
    (state) => state.completeListeningStageData
  );

  const audioClipQuestionData = useLessonStore(
    (state) => state.audioClipQuestionData
  );
  const updateAudioClipQuestionData = useLessonStore(
    (state) => state.updateAudioClipQuestionData
  );
  //Audio transcript from useLessonStore
  const s2TAudioTranscript = useLessonStore(
    (state) => state.s2TAudioTranscript
  );

  useEffect(() => {
    getAudioQuestionParts("question");
    getAudioQuestionParts("answer");
  }, []);

  useEffect(() => {
    if (audioQuestionObj.length > 0 && audioAnswerObj.length > 0) {
      mergeQuestionsAndAnswers(audioQuestionObj, audioAnswerObj);
      setReadyForSnippets(true);
      console.log("Ready for snippets:", readyForSnippets);
    }
  }, [audioQuestionObj, audioAnswerObj]);

  // Call snippet api to get answer passages if theres a transcript, questions and answers
  useEffect(() => {
    if (
      readyForSnippets &&
      completeListeningStageData.transcript &&
      completeListeningStageData.questionsAndAnswers.length > 0
    ) {
      // Call your snippet API here
      console.log("Calling snippet API with transcript and questions/answers");
      // Example API call
      fetch(
        `/api/get-audio-snippets-codes?questionsandanswers=${JSON.stringify(
          completeListeningStageData.questionsAndAnswers
        )}&transcript=${completeListeningStageData.transcript}`
      )
        .then((response) => {
          console.log("Raw Response from snippet API:", response);
          console.log("Raw Response type:", typeof response);

          return response.json();
        })
        .then((data) => {
          console.log("Received passages:", data);
          console.log("Type of data:", typeof data);
          console.log(Array.isArray(data)); // returns true if data is an array

          const updatedQAWithPassages = addPassagesToQuestions(
            completeListeningStageData.questionsAndAnswers,
            data
          );
          console.log(
            "Updated questions and answers with passages:",
            updatedQAWithPassages
          );
          updateCompleteListeningStageData({
            ...completeListeningStageData,
            questionsAndAnswers: updatedQAWithPassages,
          });
          setReadyForWordTimeData(true);
          console.log("Updated questions and answers with passages:");
        })
        .catch((error) => {
          console.error("Error fetching passages:", error);
        });
    }
  }, [readyForSnippets]);
  //SO NOT DONE
  useEffect(() => {
    const indices = findBatchPassageIndices(
      completeListeningStageData.questionsAndAnswers.map((qa) => qa.passage),
      wordTimeArray
    );
    console.log("Indices for passages:", indices);
    //use the indices and log an array of parts of the wordTimeArray for each set of indices
    const snippets = indices.map((index) => {
      if (index) {
        return wordTimeArray.slice(index.start, index.end + 1);
      }
      return [];
    });
    console.log("Snippets from wordTimeArray:", snippets);
  }, [readyForWordTimeData]);
  // Sends ocr data to the Chatgpt API to create a JSON object with questions or answers
  async function getAudioQuestionParts(type) {
    let response;
    if (type === "question") {
      response = await fetch(
        `/api/make-question-json?query=${audioQuestions}&type=${type}`
      );
    } else if (type === "answer") {
      response = await fetch(
        `/api/make-question-json?query=${audioAnswers}&type=${type}`
      );
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (type === "question") {
      console.log("Response data MAKE QUESTIONS🅠⁉️: " + JSON.stringify(data));
      console.log("Response data type: " + typeof data);
      setAudioQuestionObj(data);
      // map data to audioClipQuestionData
    } else if (type === "answer") {
      console.log("Response data MAKE ANSWERS⁉️: " + data);
      console.log("Response data type: " + typeof data);
      setAudioAnswerObj(data);
    }
  }

  function mergeQuestionsAndAnswers(questions, answers) {
    const merged = questions.map((q) => {
      const match = answers.find((a) => a.number === q.number);
      return {
        ...q,
        ...match, // adds answer field if match is found
      };
    });
    console.log("Merged Questions and Answers:");
    console.log(merged);
    updateCompleteListeningStageData({
      questionsAndAnswers: merged,
      transcript: s2TAudioTranscript,
      wordArray: wordTimeArray,
    });
  }

  function mapPassagesToQuestions(passages) {
    const updated = completeListeningStageData.questionsAndAnswers.map(
      (item, i) => ({
        ...item,
        passage: passages[i] ?? "", // Use nullish coalescing in case passage is undefined
      })
    );

    updateCompleteListeningStageData(updated);
  }
  function addPassagesToQuestions(questionsAndAnswers, passages) {
    return questionsAndAnswers.map((qa, index) => ({
      ...qa,
      passage: passages[index] ?? "", // fallback to "" if undefined
    }));
  }
  function findBatchPassageIndices(passagesArray, wordObjectsArray) {
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

    return null;
  }

  function normalizeWord(word) {
    return word.toLowerCase().replace(/[’'‘”“"!?.,;:()]/g, ""); // remove punctuation, support smart quotes too
  }
  return <QuestionDisplay />;
  //return <h1>{JSON.stringify(audioQuestionObj)}</h1>;
};

export default CreateAudioSnippets;
