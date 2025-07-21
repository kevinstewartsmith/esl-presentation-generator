import React, { useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useLessonStore } from "@app/stores/UseLessonStore";

const CreateAudioSnippets = () => {
  //audioQuestions
  const [readyForSnippets, setReadyForSnippets] = useState(false);
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
        .then((response) => response.json())
        .then((data) => {
          console.log("Received passages:", data);
          console.log("Type of data:", typeof data);
          const parsedPassageData = JSON.parse(data);
          // Update the audioClipQuestionData with the passages
          //updateAudioClipQuestionData(data);
          //mapPassagesToQuestions(data);
          const updatedQAWithPassages = addPassagesToQuestions(
            completeListeningStageData.questionsAndAnswers,
            parsedPassageData
          );
          updateCompleteListeningStageData({
            ...completeListeningStageData,
            questionsAndAnswers: updatedQAWithPassages,
          });
          console.log("Updated questions and answers with passages:");
        })
        .catch((error) => {
          console.error("Error fetching passages:", error);
        });
    }
  }, [readyForSnippets]);

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
      console.log("Response data MAKE QUESTIONS🅠⁉️: " + data);
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
  return <QuestionDisplay />;
  //return <h1>{JSON.stringify(audioQuestionObj)}</h1>;
};

export default CreateAudioSnippets;
