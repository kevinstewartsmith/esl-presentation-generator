import React, { use, useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
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
  const s2tTranscript = useAudioTextStore((state) => state.s2tTranscript);

  const hasAttemptedAudioHydration = useAudioTextStore(
    (state) => state.hasAttemptedAudioHydration,
  );

  const audioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );

  const comprehensionItems = useAudioTextStore(
    (state) => state.comprehensionItems,
  );
  const updateComprehensionItems = useAudioTextStore(
    (state) => state.updateComprehensionItems,
  );

  const [audioQuestionObj, setAudioQuestionObj] = useState([]);
  const [audioAnswerObj, setAudioAnswerObj] = useState([]);

  // Guard helper: is the comprehensionItems array ready to use?
  const comprehensionItemsExist =
    comprehensionItems && comprehensionItems.length > 0;
  console.log("qaReady:", comprehensionItemsExist);

  useEffect(() => {
    console.log("First useEffect in CreateAudioSnippets.");

    console.log(
      "Q:",
      audioQuestionObj.length,
      "A:",
      audioAnswerObj.length,
      "T:",
      s2tTranscript.length,
    );
    console.log("hasAttemptedAudioHydration:", hasAttemptedAudioHydration);
    console.log("comprehensionItemsExist:", comprehensionItemsExist);
    console.log("audioQuestions:", audioQuestions);
    console.log("audioAnswers:", audioAnswers);
    if (!hasAttemptedAudioHydration) return;
    if (!comprehensionItemsExist) {
      getAudioQuestionParts("question");
      getAudioQuestionParts("answer");
    }
  }, [hasAttemptedAudioHydration]);

  useEffect(() => {
    console.log("Second useEffect in CreateAudioSnippets.");

    console.log(
      "Q:",
      audioQuestionObj.length,
      "A:",
      audioAnswerObj.length,
      "T:",
      s2tTranscript.length,
    );
    console.log("audioQuestions: ", audioQuestions);
    console.log("audioAnswers: ", audioAnswers);

    if (
      audioQuestionObj.length > 0 &&
      audioAnswerObj.length > 0 &&
      s2tTranscript.length > 0 &&
      !comprehensionItemsExist
    ) {
      mergeQuestionsAndAnswers(audioQuestionObj, audioAnswerObj);
      setReadyForSnippets(true);
    }
  }, [audioQuestionObj, audioAnswerObj]);

  // Call snippet api to get answer passages
  // Takes comprehensionItems and s2tTranscript as input, returns updated comprehensionItems with passages

  useEffect(() => {
    console.log("Third useEffect in CreateAudioSnippets.");

    console.log(
      "Q:",
      audioQuestionObj.length,
      "A:",
      audioAnswerObj.length,
      "T:",
      s2tTranscript.length,
    );

    if (!readyForSnippets) return;
    if (!s2tTranscript) return;
    if (!comprehensionItemsExist) return;

    async function fetchPassages() {
      try {
        const qa = JSON.stringify(comprehensionItems);

        const response = await fetch("/api/get-audio-snippets-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionsAndAnswers: qa,
            transcript: s2tTranscript,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch passages");

        const data = await response.json();

        const updated = addPassagesToQuestions(comprehensionItems, data);
        updateComprehensionItems(updated);
        setReadyForWordTimeData(true);
      } catch (error) {
        console.error("Error fetching passages:", error);
      }
    }

    fetchPassages();
  }, [readyForSnippets]);

  //SO NOT DONE
  useEffect(() => {
    if (!readyForWordTimeData) return;
    if (!comprehensionItemsExist) return;
    if (!wordTimeArray || wordTimeArray.length === 0) return;

    const indices = findBatchPassageIndices(
      comprehensionItems.map((qa) => qa.passage),
      wordTimeArray,
    );

    const snippets = indices.map((index) => {
      if (index) {
        return wordTimeArray.slice(index.start, index.end + 1);
      }
      return [];
    });

    const updated = comprehensionItems.map((qa, i) => ({
      ...qa,
      snippet: snippets[i] || [],
      indices: indices[i] || null,
    }));

    updateComprehensionItems(updated);

    updated.length > 0
      ? setReadyForAudioClips(true)
      : setReadyForAudioClips(false);
  }, [readyForWordTimeData]);

  useEffect(() => {
    if (!readyForAudioClips || !comprehensionItemsExist) {
      return;
    }

    const fetchSnippets = async () => {
      const splitAudioFileArray = await splitAudioFile(
        audioFileName,
        wordTimeArray,
        comprehensionItems,
      );
      const updated = addSnippetsFileNamesToQuestions(
        comprehensionItems,
        splitAudioFileArray,
      );
      updateComprehensionItems(updated);
      setReadyForAudioClips(true);
    };

    fetchSnippets();
  }, [readyForAudioClips]);

  async function getAudioQuestionParts(type) {
    const query = type === "question" ? audioQuestions : audioAnswers;

    const response = await fetch("/api/make-question-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, type }),
    });

    if (!response.ok) throw new Error("make-question-json failed");
    const data = await response.json();
    console.log(
      "getAudioQuestionParts type:",
      type,
      "response.ok:",
      response.ok,
      "data:",
      data,
    );

    if (type === "question") {
      setAudioQuestionObj(data);
    } else if (type === "answer") {
      setAudioAnswerObj(data);
    }
  }

  function mergeQuestionsAndAnswers(questions, answers) {
    const merged = mergeItems(questions, answers);
    updateComprehensionItems(merged);
  }

  return <QuestionDisplay />;
};

export default CreateAudioSnippets;
