"use client";
import { useState, Fragment, useContext } from 'react';
import { createWorker } from 'tesseract.js';
import { Grid, Item } from '@mui/material';
import AudioSlicer from './components/AudioSlicer';
import { AudioTextContext } from './contexts/AudioTextContext';
import Player from './components/Player';
import LlamaButton from './components/LlamaButton';
import { transcribeAudioTest } from './utils/speech-to-text';
import Link from 'next/link';
// import mui grid
//import  Grid  from '@mui/material';


export default function Home() {
  // Add an upload button. When I click it I can upload an image that will be displayed on the page.
  const { originalAudio, setAudioSnippet, updateExtractedText, extractedText, updateQuestions, questions, updateTranscript, transcript, updateS2tData,s2tData, updateSnippetData, snippetData } = useContext(AudioTextContext);
  const [image, setImage] = useState(null);


  const [textOCR, setTextOCR] = useState('');

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(URL.createObjectURL(selectedImage));
  };

  async function handleReadText() {
    
      const worker = await createWorker('eng');
      const ret = await worker.recognize(image);
      console.log(ret.data.text);
      //setTextOCR(ret.data.text);
      updateExtractedText(ret.data.text);
      await worker.terminate();
    ;
  }

//https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-70b-chat-hf

const fetchCollections = async () => {
  const res = await fetch(`/api/collection/gallery/${collectionID}`)
  const data = await res.json()
  console.log(data);
  updateCollection(data)
}



const handleTrimAudio = (startTimestamp, endTimestamp) => {
  // Use a library like Web Audio API to trim the audio
  // Set the trimmed audio snippet in the context
  setAudioSnippet(trimAudio(originalAudio, startTimestamp, endTimestamp));
};

function playTestAudio() {
  var audio = new Audio('audio/eng.mp3');
  audio.play();

  
}

async function getTranscript() {
  const response = await fetch(`/api/google-api-s2t`);
  //const response = await fetch(`/api/test`);

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  const data = await response.json();
  updateS2tData(data);

  const combinedTranscript = data.map((element) => {
    return element.alternatives[0].transcript;
  }).join(' ');
  console.log(combinedTranscript);
  // for (let i = 0; i < data.length; i++) {
  //   console.log(data[i].alternatives[0].transcript);
  // }

  updateTranscript(combinedTranscript);
}

async function getQuestions() {
  const response = await fetch(`/api/make-question-json?query=${extractedText}`);
  //const response = await fetch(`/api/test`);

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  const data = await response.json();
  
  const contentString = data.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
  let parsedArray = JSON.parse(contentString);
  console.log(parsedArray[0].question);

  updateQuestions(parsedArray);
}

async function getAudioSnippetTimeCodes() {

  const transcriptArray = s2tData.map(element => element.alternatives[0].transcript);
  console.log(transcriptArray);
  console.log("Questions to send")
  console.log(questions);
  const params = {
    questions: JSON.stringify(questions),
    audiodata: JSON.stringify(transcriptArray)
  }
  const questionsString = JSON.stringify(questions)
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/get-audio-snippets-codes?${queryString}`;
  const url2 = `/api/get-audio-snippets-codes?questions=${questionsString}&audiodata=${transcriptArray}`;
  const response = await fetch(url2);
  //const response = await fetch(`/api/get-audio-snippets-codes?questions=hello&audio-data=world`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log("Response Data:", data);


  const contentString = data.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
  
  console.log("Content string: " + contentString);
 
    
  let parsedArray = JSON.parse(data);
  console.log(parsedArray);
  console.log(typeof parsedArray[0].question);

  updateSnippetData(parsedArray)
}

  return (
    <div style={{margin: 50 }}>
    <h1>ESL Presentation Generator</h1>
    <Grid container direction={"row"} spacing={2} padding={20}>
      <Grid item xs={12} sm={6}>

      <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Uploaded" style={{ maxWidth: '300px' }} />}
      {/* //text forn for title and subit button */}
      <br></br>
      <button onClick={handleReadText} style={{borderWidth:"2px", borderColor:"white"}}>Read Text</button>


      </Grid>  
      <Grid item xs={12} sm={6}>
      <Grid container direction={"row"} spacing={2} padding={20}>
        <Grid item xs={12} sm={6}></Grid>
          <div>
              <h1>Extracted Text</h1>
              <pre>
                {/* {textOCR.split('\n').map((line, index) => ( */}
                  {extractedText ? extractedText.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                )) : null}
              </pre>
            </div>
          </Grid>
 
      </Grid>


    </Grid>
    <div>



    </div>
    <AudioSlicer />
    <Player />
    <br></br>
    <br></br>
    <br></br>
    <LlamaButton />
    <br></br>
    <button onClick={playTestAudio}>Test audio</button>

    <br /> 
    <Link href="/presentation-preview/1" passHref>
      {/* <a target="_blank" rel="noopener noreferrer"> */}
        Open in new window
      {/* </a> */}
     
    </Link>
    <br></br>
    <button onClick={getQuestions}>Get Questions</button>
    { questions ? questions.map((question, index) => {
      return (
        <div key={index}>
          <h3>Question {question.number}</h3>
          <p>{question.question}</p>
        </div>
      )
    }) : null }

    <br></br>
    <button onClick={getTranscript}>Get Transcript</button>
    <br></br>
    { transcript ? <p>{transcript}</p> : null }
    <br></br>
    <button onClick={getAudioSnippetTimeCodes}>Get Audio Snippet Time Codes</button>
    <br></br>
    {snippetData ? <p>{JSON.stringify(snippetData)}</p> : null}
    <Grid container spacing={2} >
      {snippetData ? snippetData.map((snippet, index) => {
        return (
          <Grid item xs={12}>
          <div style={{ borderWidth: 3, borderColor: "white", borderRadius: 15, width: "100%", height: "100%", padding:30}}>
            <h1 style={{ fontSize:"2rem" }}><strong>{`${index + 1} - ` + snippetData[index].question}</strong></h1>
            <h1><em>{snippetData[index].answer}</em></h1>
            <h1 style={{ fontSize:"1.5rem" }}><em>"{snippetData[index].snippet}"</em></h1>
          </div>            
          </Grid>
        )
      }) : null}
      
    </Grid>

</div>



  )
}
