"use client"
// audioContext.js
import { createContext, useState, useEffect } from 'react';

const AudioTextContext = createContext();

const AudioTextProvider = ({ children }) => {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [audioSnippet, setAudioSnippet] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [slicedAudioBuffer, setSlicedAudioBuffer] = useState(null);
  const [snippetBufferArray, setSnippetBufferArray] = useState([]);
  const [snippetTimeStamps, setSnippetTimeStamps] = useState([
    {start: 5, end: 10},
    {start: 15, end: 20},
    {start: 30, end: 40.5},
  ]);
  const [questions, setQuestions] = useState()
  const [transcript, setTranscript] = useState('')
  const [s2tData, setS2tData] = useState({});
  const [snippetData, setSnippetData] = useState()

  function updateSnippetData(data) {
    setSnippetData(data)
  }

  function updateS2tData(newData) {
    setS2tData(newData);
  }

  function updateTranscript(newTranscript) {
    setTranscript(newTranscript);
  }

  function updateQuestions(newQuestions) {
    setQuestions(newQuestions);
  }

  function updateExtractedText(newText) {
    setExtractedText(newText);
  }
  function updateAudioURL(newURL) {
    setAudioURL(newURL);
    console.log("audioURL", audioURL);
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
    setSnippetBufferArray(snippetBufferArray => [...snippetBufferArray, newSnippet]);
    //setMyArray(prevArray => [...prevArray, newValue])
  }

  return (
    <AudioTextContext.Provider value={{ 
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
      questions,
      updateQuestions,
      transcript,
      updateTranscript,
      s2tData,
      updateS2tData,
      snippetData,
      updateSnippetData
    }}>
        {children}
    </AudioTextContext.Provider>
  );
};

export { AudioTextContext, AudioTextProvider };
