import React, { useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useLessonStore } from "@app/stores/UseLessonStore";

const CreateAudioSnippets = () => {
  //audioQuestions
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
    }
  }, [audioQuestionObj, audioAnswerObj]);

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
  return (
    <QuestionDisplay questions={audioQuestionObj} answers={audioAnswerObj} />
  );
  //return <h1>{JSON.stringify(audioQuestionObj)}</h1>;
};

export default CreateAudioSnippets;
