import React, { use, useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useLessonStore } from "@app/stores/useLessonStore";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
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
  const [trimmedAudioClips, setTrimmedAudioClips] = useState([]);
  const [readyForAudioClips, setReadyForAudioClips] = useState(false);
  const [readyForSnippets, setReadyForSnippets] = useState(false);
  const [readyForWordTimeData, setReadyForWordTimeData] = useState(false);
  const wordTimeArray = useAudioTextStore((state) => state.wordTimeArray);

  const audioQuestions = useAudioTextStore((state) => state.audioQuestions);
  const audioAnswers = useAudioTextStore((state) => state.audioAnswers);

  const [audioQuestionObj, setAudioQuestionObj] = useState([]);
  const [audioAnswerObj, setAudioAnswerObj] = useState([]);
  const updateCompleteListeningStageData = useLessonStore(
    (state) => state.updateCompleteListeningStageData,
  );
  const completeListeningStageData = useLessonStore(
    (state) => state.completeListeningStageData,
  );

  const audioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );

  const audioClipQuestionData = useLessonStore(
    (state) => state.audioClipQuestionData,
  );
  const updateAudioClipQuestionData = useLessonStore(
    (state) => state.updateAudioClipQuestionData,
  );

  const s2tTranscript = useAudioTextStore((state) => state.s2tTranscript);

  const audioSnippetFilenameArray = useLessonStore(
    (state) => state.audioSnippetFilenameArray,
  );
  const updateAudioSnippetFilenameArray = useLessonStore(
    (state) => state.updateAudioSnippetFilenameArray,
  );

  // Guard helper: is the questionsAndAnswers array ready to use?
  const qaReady =
    completeListeningStageData?.questionsAndAnswers &&
    completeListeningStageData.questionsAndAnswers.length > 0;

  useEffect(() => {
    if (!qaReady) {
      getAudioQuestionParts("question");
      getAudioQuestionParts("answer");
    }
  }, []);

  useEffect(() => {
    if (audioQuestionObj.length > 0 && audioAnswerObj.length > 0 && !qaReady) {
      mergeQuestionsAndAnswers(audioQuestionObj, audioAnswerObj);
      setReadyForSnippets(true);
    }
  }, [audioQuestionObj, audioAnswerObj]);

  // Call snippet api to get answer passages
  useEffect(() => {
    if (!readyForSnippets) return;
    if (!s2tTranscript) return;
    if (!qaReady) return;

    const qa = JSON.stringify(completeListeningStageData.questionsAndAnswers);
    const url =
      "/api/get-audio-snippets-codes?questionsandanswers=" +
      qa +
      "&transcript=" +
      s2tTranscript;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const updatedQAWithPassages = addPassagesToQuestions(
          completeListeningStageData.questionsAndAnswers,
          data,
        );
        updateCompleteListeningStageData({
          ...completeListeningStageData,
          questionsAndAnswers: updatedQAWithPassages,
        });
        setReadyForWordTimeData(true);
      })
      .catch((error) => {
        console.error("Error fetching passages:", error);
      });
  }, [readyForSnippets]);

  //SO NOT DONE
  useEffect(() => {
    if (!readyForWordTimeData) return;
    if (!qaReady) return;
    if (!wordTimeArray || wordTimeArray.length === 0) return;

    const indices = findBatchPassageIndices(
      completeListeningStageData.questionsAndAnswers.map((qa) => qa.passage),
      wordTimeArray,
    );

    const snippets = indices.map((index) => {
      if (index) {
        return wordTimeArray.slice(index.start, index.end + 1);
      }
      return [];
    });

    const updatedQuestionsAndAnswers =
      completeListeningStageData.questionsAndAnswers.map((qa, i) => ({
        ...qa,
        snippet: snippets[i] || [],
        indices: indices[i] || null,
      }));

    updateCompleteListeningStageData({
      ...completeListeningStageData,
      questionsAndAnswers: updatedQuestionsAndAnswers,
    });

    updatedQuestionsAndAnswers.length > 0
      ? setReadyForAudioClips(true)
      : setReadyForAudioClips(false);
  }, [readyForWordTimeData]);

  useEffect(() => {
    if (!readyForAudioClips || !qaReady) {
      return;
    }

    const fetchSnippets = async () => {
      const splitAudioFileArray = await splitAudioFile(
        completeListeningStageData,
      );
      updateAudioSnippetFilenameArray(splitAudioFileArray);
      const updatedQuestionsAndAnswers = addSnippetsFileNamesToQuestions(
        completeListeningStageData.questionsAndAnswers,
        splitAudioFileArray,
      );
      updateCompleteListeningStageData({
        ...completeListeningStageData,
        questionsAndAnswers: updatedQuestionsAndAnswers,
      });
      setReadyForAudioClips(true);
    };

    fetchSnippets();
  }, [readyForAudioClips]);

  async function getAudioQuestionParts(type) {
    let response;
    if (type === "question") {
      const url =
        "/api/make-question-json?query=" + audioQuestions + "&type=" + type;
      response = await fetch(url);
    } else if (type === "answer") {
      const url =
        "/api/make-question-json?query=" + audioAnswers + "&type=" + type;
      response = await fetch(url);
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (type === "question") {
      setAudioQuestionObj(data);
    } else if (type === "answer") {
      setAudioAnswerObj(data);
    }
  }

  function mergeQuestionsAndAnswers(questions, answers) {
    const merged = mergeItems(questions, answers);
    updateCompleteListeningStageData({
      ...completeListeningStageData,
      questionsAndAnswers: merged,
      transcript: s2tTranscript,
      wordArray: wordTimeArray,
      audioFileName: audioFileName,
    });
  }

  return <QuestionDisplay />;
};

export default CreateAudioSnippets;
