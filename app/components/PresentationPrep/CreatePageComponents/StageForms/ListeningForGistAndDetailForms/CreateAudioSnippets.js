import React, { use, useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useLessonStore } from "@app/stores/UseLessonStore";
import {
  mergeItems,
  addPassagesToQuestions,
  findBatchPassageIndices,
  addSnippetsFileNamesToQuestions,
} from "@app/utils/CreateAudioSnippetsUtil";
import {
  splitAudioFile,
  playFromIndexedDB,
} from "@app/utils/AudioSplittingUtil";

const CreateAudioSnippets = () => {
  //audioQuestions
  const [trimmedAudioClips, setTrimmedAudioClips] = useState([]);
  const [readyForAudioClips, setReadyForAudioClips] = useState(false);
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
  const audioFileName = useLessonStore((state) => state.audioFileName);
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

  const audioSnippetFilenameArray = useLessonStore(
    (state) => state.audioSnippetFilenameArray
  );
  const updateAudioSnippetFilenameArray = useLessonStore(
    (state) => state.updateAudioSnippetFilenameArray
  );

  //Takes questions OCR and sends to api to be parsed into objects. Then the objects are set in state. This is happening every time the component mounts
  useEffect(() => {
    console.log("First UseEffect Firing in CreateAudioSnippets.");
    //Check if completeListeningStageData.questionsAndAnswers is null or empty
    if (
      !completeListeningStageData.questionsAndAnswers ||
      completeListeningStageData.questionsAndAnswers.length === 0
    ) {
      getAudioQuestionParts("question");
      getAudioQuestionParts("answer");
    }
  }, []);

  useEffect(() => {
    if (
      audioQuestionObj.length > 0 &&
      audioAnswerObj.length > 0 &&
      (!completeListeningStageData.questionsAndAnswers ||
        completeListeningStageData.questionsAndAnswers.length === 0)
    ) {
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
    //map through completeListeningStageData.questionsAndAnswers and add the snippets and indices to each question
    const updatedQuestionsAndAnswers =
      completeListeningStageData.questionsAndAnswers.map((qa, i) => ({
        ...qa,
        snippet: snippets[i] || [], // Use empty array if no snippet found
        indices: indices[i] || null, // Use null if no indices found
      }));
    console.log(
      "Updated questions and answers with snippets and indices:",
      updatedQuestionsAndAnswers
    );

    updateCompleteListeningStageData({
      ...completeListeningStageData,
      questionsAndAnswers: updatedQuestionsAndAnswers,
    });

    updatedQuestionsAndAnswers.length > 0
      ? setReadyForAudioClips(true)
      : setReadyForAudioClips(false);
  }, [readyForWordTimeData]);

  useEffect(() => {
    if (
      !readyForAudioClips ||
      completeListeningStageData.questionsAndAnswers.length === 0
    ) {
      console.log("Not ready for audio clips yet.");
      return;
    }

    const fetchSnippets = async () => {
      const splitAudioFileArray = await splitAudioFile(
        completeListeningStageData
      );
      console.log(
        "Split audio file array in CreateAudioSnippets:",
        splitAudioFileArray
      );
      updateAudioSnippetFilenameArray(splitAudioFileArray);
      const updatedQuestionsAndAnswers = addSnippetsFileNamesToQuestions(
        completeListeningStageData.questionsAndAnswers,
        splitAudioFileArray
      );
      console.log(
        "Updated questions and answers with snippets:",
        updatedQuestionsAndAnswers
      );
      updateCompleteListeningStageData({
        ...completeListeningStageData,
        questionsAndAnswers: updatedQuestionsAndAnswers,
      });
      setReadyForAudioClips(true);
    };

    fetchSnippets();
  }, [readyForAudioClips]);

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
    const merged = mergeItems(questions, answers);
    console.log("Merged Questions and Answers:");
    console.log(merged);

    updateCompleteListeningStageData({
      ...completeListeningStageData,
      questionsAndAnswers: merged,
      transcript: s2TAudioTranscript,
      wordArray: wordTimeArray,
      audioFileName: audioFileName,
    });
  }
  //}

  return <QuestionDisplay />;
};

export default CreateAudioSnippets;
