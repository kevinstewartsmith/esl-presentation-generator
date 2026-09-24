import React, { use, useEffect, useState } from "react";
import QuestionDisplay from "@app/components/QuestionDisplay";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import {
  mergeItems,
  addPassagesToQuestions,
  addExplanationsToQuestions,
  addIndicesToPassages,
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
    if (!hasAttemptedAudioHydration) return;
    if (!comprehensionItemsExist) {
      getAudioQuestionParts("question");
      getAudioQuestionParts("answer");
    }
  }, [hasAttemptedAudioHydration]);

  useEffect(() => {
    console.log("Second useEffect in CreateAudioSnippets.");

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

  // 3. Two independent Gemini calls, in parallel:
  //    - passages:     { results: [{ number, passages: ["text", ...] }] }
  //    - explanations: { results: [{ number, explanation }] }
  //    Kept as separate routes (one concern each, so either can be regenerated
  //    alone) but merged into ONE store update here so they don't clobber each
  //    other's field. Explanation needs no word times, so it lands now.
  useEffect(() => {
    console.log("Third useEffect in CreateAudioSnippets.");

    if (!readyForSnippets) return;
    if (!s2tTranscript) return;
    if (!comprehensionItemsExist) return;

    async function fetchPassagesAndExplanations() {
      try {
        const [passageRes, explanationRes] = await Promise.all([
          fetch("/api/get-audio-snippets-codes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionsAndAnswers: comprehensionItems, // the array itself, not stringified
              transcript: s2tTranscript,
              // maxPassages: 3, // optional per-lesson override of the route's MAX_PASSAGES knob
            }),
          }),
          fetch("/api/get-answer-explanation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionsAndAnswers: comprehensionItems,
              transcript: s2tTranscript,
            }),
          }),
        ]);

        if (!passageRes.ok) throw new Error("Failed to fetch passages");
        if (!explanationRes.ok) throw new Error("Failed to fetch explanations");

        const passageData = await passageRes.json();
        const explanationData = await explanationRes.json();

        // Apply both to one base snapshot → single atomic update.
        let updated = addPassagesToQuestions(
          comprehensionItems,
          passageData.results,
        );
        updated = addExplanationsToQuestions(updated, explanationData.results);

        updateComprehensionItems(updated);
        setReadyForWordTimeData(true);
      } catch (error) {
        console.error("Error fetching passages/explanations:", error);
      }
    }

    fetchPassagesAndExplanations();
  }, [readyForSnippets]);

  // 4. Resolve each passage's word-index range against the transcript word array.
  useEffect(() => {
    if (!readyForWordTimeData) return;
    if (!comprehensionItemsExist) return;
    if (!wordTimeArray || wordTimeArray.length === 0) return;

    const updated = addIndicesToPassages(comprehensionItems, wordTimeArray);
    updateComprehensionItems(updated);

    setReadyForAudioClips(updated.length > 0);
  }, [readyForWordTimeData]);

  // 5. Cut an audio clip for each passage, then attach the filenames.
  useEffect(() => {
    if (!readyForAudioClips || !comprehensionItemsExist) {
      return;
    }

    const fetchSnippets = async () => {
      // clipsByQuestion[i] is an array of clip filenames aligned to
      // comprehensionItems[i].passages (same order).
      const clipsByQuestion = await splitAudioFile(
        audioFileName,
        wordTimeArray,
        comprehensionItems,
      );
      const updated = addSnippetsFileNamesToQuestions(
        comprehensionItems,
        clipsByQuestion,
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
