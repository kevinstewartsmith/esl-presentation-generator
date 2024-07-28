import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  Fragment,
} from "react";
import { AudioTextContext } from "../contexts/AudioTextContext";
import { Grid } from "@mui/material";
import Snippet from "./Snippet";

const Player = () => {
  const {
    updateAudioURL,
    audioURL,
    updateAudioBuffer,
    audioBuffer,
    slicedAudioBuffer,
    updateSlicedAudioBuffer,
    snippetBufferArray,
    updateSnippetBufferArray,
    snippetTimeStamps,
    updateSnippetTimeStamps,
    appendToSnippetBufferArray,
  } = useContext(AudioTextContext);
  //const [audioBuffer, setAudioBuffer] = useState(null);
  //const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const audioContextRef = useRef(null);
  const fileInputRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    // Create AudioContext only if it hasn't been created yet
    if (!audioContextRef.current) {
      window.AudioContext = window.AudioContext;
      audioContextRef.current = new AudioContext();
    }
    async function fetchAudioFile(audioURL) {
      try {
        const response = await fetch(audioURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        updateAudioBuffer(buffer);
      } catch (error) {
        console.error("Error fetching or decoding audio file:", error);
      }
    }
    fetchAudioFile(audioURL);

    // Other component setup logic can go here

    // return () => {
    //   // Cleanup logic: close the AudioContext when the component is unmounted
    //   if (audioContextRef.current.state !== 'closed') {
    //     audioContextRef.current.close();
    //   }
    // };
  }, [audioURL, snippetBufferArray]);
  //make useffect to fetch audio data with audioURL
  async function fetchAudioFile(audioURL) {
    try {
      const response = await fetch(audioURL);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      updateAudioBuffer(buffer);
    } catch (error) {
      console.error("Error fetching or decoding audio file:", error);
    }
  }

  function sliceAudio() {
    // Assume you have an AudioBuffer stored in the variable 'originalAudioBuffer'
    // and you have a start time and end time (in seconds) for the slice

    const startTime = 30; // Example start time in seconds
    const endTime = 40; // Example end time in seconds

    // Calculate the start and end positions in samples
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);

    // Get the sliced data from the original AudioBuffer
    const slicedData = audioBuffer
      .getChannelData(0)
      .slice(startSample, endSample);

    // Create a new AudioBuffer to store the sliced data
    const slicedAudioBuffer = new AudioBuffer({
      numberOfChannels: 1, // Assuming a mono audio file, change it to 2 for stereo
      length: slicedData.length,
      sampleRate: sampleRate,
    });

    // Set the sliced data to the new AudioBuffer
    slicedAudioBuffer.getChannelData(0).set(slicedData);

    // Now 'slicedAudioBuffer' contains the sliced audio data
    // You can store it in a state variable or use it as needed
    updateSlicedAudioBuffer(slicedAudioBuffer);
  }

  function createSnippetArray() {
    console.log("snippetTimeStamps", snippetTimeStamps.length);
    for (let i = 0; i < snippetTimeStamps.length; i++) {
      createSnippet(snippetTimeStamps[i].start, snippetTimeStamps[i].end);
      console.log(
        "snippetTimeStamps",
        snippetTimeStamps[i].start,
        snippetTimeStamps[i].end
      );
    }
  }

  function createSnippet(startTime, endTime) {
    // Calculate the start and end positions in samples
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);

    // Get the sliced data from the original AudioBuffer
    const slicedData = audioBuffer
      .getChannelData(0)
      .slice(startSample, endSample);

    // Create a new AudioBuffer to store the sliced data
    const slicedAudioBuffer = new AudioBuffer({
      numberOfChannels: 1, // Assuming a mono audio file, change it to 2 for stereo
      length: slicedData.length,
      sampleRate: sampleRate,
    });

    // Set the sliced data to the new AudioBuffer
    slicedAudioBuffer.getChannelData(0).set(slicedData);

    // Now 'slicedAudioBuffer' contains the sliced audio data
    // You can store it in a state variable or use it as needed
    appendToSnippetBufferArray(slicedAudioBuffer);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can do something with the textValue here, like save it to state or send it to a server
    //log submitted vlue

    updateAudioURL(textValue);
    console.log("Submitted Text:", textValue);
  };
  const handleURLInputChange = (e) => {
    setTextValue(e.target.value);
  };
  const handleAudioFile = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        updateAudioBuffer(buffer);
        console.log("audioBuffer", audioBuffer);
      } catch (error) {
        console.error("Error decoding audio file:", error);
      }
    }
  };

  const playButtonPressed = () => {
    if (audioBuffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  };
  const playButtonPressedSliced = () => {
    if (slicedAudioBuffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = slicedAudioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  };

  return (
    <div style={{ borderWidth: 1, borderColor: "white", padding: 50 }}>
      <Grid container direction={"row"} spacing={2} padding={20}>
        <Grid item xs={12} sm={6}>
          <h1>Audio Slicer</h1>
          <br />
          <form onSubmit={handleSubmit}>
            <h3>Audio Link</h3>
            <input
              type="text"
              value={textValue}
              onChange={handleURLInputChange}
            />
            <button type="submit">Submit</button>
          </form>
          <h1>{audioURL}</h1>
          <h1>OR</h1>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAudioFile}
            accept="audio/*"
          />
          <div>
            <button onClick={playButtonPressed} disabled={!audioBuffer}>
              {playing ? "pause" : "play"}
            </button>
          </div>

          {audioBuffer ? (
            <button onClick={sliceAudio}>Slice Audio </button>
          ) : null}
          {snippetBufferArray ? (
            <button onClick={createSnippetArray}>Create Multi Snippets </button>
          ) : null}

          <div>
            <button
              onClick={playButtonPressedSliced}
              disabled={!slicedAudioBuffer}
            >
              {playing ? "pause" : "play"}
            </button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <h1>Audio Snippets</h1>
          {snippetBufferArray.map((snippet, index) => (
            <Fragment key={index}>
              <Snippet snippet={snippet} index={index} />
            </Fragment>
          ))}
          {<h1>{"Snippet Array Count: " + snippetBufferArray.length}</h1>}
          {<h1>{"Snippet timestamps:" + snippetTimeStamps.length}</h1>}
        </Grid>
      </Grid>
    </div>
  );
};

export default Player;
