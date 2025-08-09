"use client";
// audioContext.js
import { createContext, useState, useEffect } from "react";

const AudioTextContext = createContext();

const AudioTextProvider = ({ children }) => {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [audioSnippet, setAudioSnippet] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [slicedAudioBuffer, setSlicedAudioBuffer] = useState(null);
  const [snippetBufferArray, setSnippetBufferArray] = useState([]);
  const [snippetTimeStamps, setSnippetTimeStamps] = useState([
    { start: 5, end: 10 },
    { start: 15, end: 20 },
    { start: 30, end: 40.5 },
  ]);
  const [audioQuestions, setAudioQuestions] = useState();
  const [transcript, setTranscript] = useState("");
  const [s2tData, setS2tData] = useState({});
  const [snippetData, setSnippetData] = useState();
  const [bucketContents, setBucketContents] = useState();
  const [selectedAudioFileName, setSelectedAudioFileName] = useState();
  const [wordTimeArray, setWordTimeArray] = useState();
  const [fullAudioBuffer, setFullAudioBuffer] = useState(); //Full file of an audio track. Updated when a track from the bucket is played
  const [lessonIDAudioContext, setLessonIDAudioContext] = useState("");

  //post listening questions to the database
  useEffect(() => {
    //console.log("Post Listening Questions Data");
    const stageID = "Listening for Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    const encodedQuestions = encodeURIComponent(audioQuestions);
    const stringifiedQuestions = JSON.stringify(audioQuestions);
    //console.log("Encoded Stage ID:", encodedStageID);
    //console.log("Stringified Questions:", stringifiedQuestions);
    //console.log("Questions Type:", typeof audioQuestions);
    const userID = "kevinstewartsmith";
    async function postListeningQuestions() {
      //console.log(
      //   "THIS IS THE LESSON ID FOR POSTING QUESTIONS:",
      //   lessonIDAudioContext
      // );

      try {
        const response = await fetch(
          `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonIDAudioContext}&stageID=${encodedStageID}&data=${stringifiedQuestions}&textType=AudioQuestionText`,
          { method: "POST" }
        );
        const data = await response.json();
        //console.log("RESPONSE FROM POSTING QUESTION TEXT DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postListeningQuestions();
  }, [audioQuestions]);
  //end post listening questions to the database

  //post audio transcript to the database
  useEffect(() => {
    //console.log("Post Audio Transcript Data");
    const stageID = "Listening for Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    const encodedTranscript = encodeURIComponent(transcript);
    const stringifiedTranscript = JSON.stringify(transcript);
    //console.log("Encoded Stage ID:", encodedStageID);
    //console.log("Encoded Transcript:", encodedTranscript);
    const userID = "kevinstewartsmith";
    async function postAudioTranscript() {
      // console.log(
      //   "THIS IS THE LESSON ID FOR POSTING TRANSCRIPT:",
      //   lessonIDAudioContext
      // );

      try {
        const response = await fetch(
          `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonIDAudioContext}&stageID=${encodedStageID}&data=${stringifiedTranscript}&textType=AudioTranscript`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING TRANSCRIPT DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postAudioTranscript();
  }, [transcript]);
  //end post audio transcript to the database

  async function fetchAudioQuestionDataFromDB(userID, lessonID, stageID) {
    const stage = "Listening for Gist and Detail";
    const encodedStageID = encodeURIComponent(stage);
    //console.log("Getting Textbook Data from Firestore");
    try {
      const response = await fetch(
        `/api/firestore/get-textbook-data?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      //console.log("Textbook DATA from Firestore:", data);
      //data.texts.transcript ? setTextbook(data.texts.transcript) : null;
      data.audioQuestions ? setAudioQuestions(data.audioQuestions) : null;
      // data.questions.transcript
      //   ? setQuestions(data.questions.transcript)
      //   : null;
      data.transcript ? setTranscript(data.transcript) : null;
      data.answers ? setAnswers(data.answers) : null;
    } catch (error) {
      console.error(error);
    }
  }

  function updateLessonIDForAudioData(id) {
    setLessonIDAudioContext(id);
    //console.log("Lesson ID for audio:", id);
  }

  function updateFullAudioBuffer(buffer) {
    setFullAudioBuffer(buffer);
  }

  function updateWordTimeArray(array) {
    setWordTimeArray(array);
  }

  function updateSelectedAudioFileName(name) {
    setSelectedAudioFileName(name);
  }

  function updateBucketContents(contents) {
    setBucketContents(contents);
  }

  function updateSnippetData(data) {
    setSnippetData(data);
  }

  function updateS2tData(newData) {
    setS2tData(newData);
  }

  function updateTranscript(newTranscript) {
    setTranscript(newTranscript);
  }

  function updateAudioQuestions(newQuestions) {
    setAudioQuestions(newQuestions);
  }

  function updateExtractedText(newText) {
    setExtractedText(newText);
  }
  function updateAudioURL(newURL) {
    setAudioURL(newURL);
    //console.log("audioURL", audioURL);
  }

  function updateAudioBuffer(newBuffer) {
    setAudioBuffer(newBuffer);
  }
  function updateSlicedAudioBuffer(newBuffer) {
    setSlicedAudioBuffer(newBuffer);
  }

  function updateSnippetBufferArray(newArray) {
    setSnippetBufferArray(newArray);
  }

  function updateSnippetTimeStamps(newArray) {
    setSnippetTimeStamps(newArray);
  }
  function appendToSnippetBufferArray(newSnippet) {
    //setSnippetBufferArray([...snippetBufferArray, newSnippet]);
    setSnippetBufferArray((snippetBufferArray) => [
      ...snippetBufferArray,
      newSnippet,
    ]);
    //setMyArray(prevArray => [...prevArray, newValue])
  }

  return (
    <AudioTextContext.Provider
      value={{
        originalAudio,
        setOriginalAudio,
        audioSnippet,
        setAudioSnippet,
        updateExtractedText,
        extractedText,
        audioURL,
        updateAudioURL,
        updateAudioBuffer,
        audioBuffer,
        slicedAudioBuffer,
        updateSlicedAudioBuffer,
        snippetBufferArray,
        updateSnippetBufferArray,
        snippetTimeStamps,
        updateSnippetTimeStamps,
        appendToSnippetBufferArray,
        audioQuestions,
        updateAudioQuestions,
        transcript,
        updateTranscript,
        s2tData,
        updateS2tData,
        snippetData,
        updateSnippetData,
        bucketContents,
        updateBucketContents,
        selectedAudioFileName,
        updateSelectedAudioFileName,
        wordTimeArray,
        updateWordTimeArray,
        fullAudioBuffer,
        updateFullAudioBuffer,
        updateLessonIDForAudioData,
        lessonIDAudioContext,
        fetchAudioQuestionDataFromDB,
      }}
    >
      {children}
    </AudioTextContext.Provider>
  );
};

export { AudioTextContext, AudioTextProvider };
