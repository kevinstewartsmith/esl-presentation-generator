import {useContext} from 'react'
import { AudioTextContext } from '../contexts/AudioTextContext';


const Transcript = () => {

    const { updateTranscript, transcript, updateS2tData, selectedAudioFileName } = useContext(AudioTextContext);

    async function getTranscript() {
        const response = await fetch(`/api/google-api-s2t?name=${selectedAudioFileName}`);
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

    function createTimeArray(data) {
        const wordsInfo = text[4].alternatives[0].words
        console.log(wordsInfo);
    }
  return (
    <div>
        <button onClick={getTranscript}>Get Transcript</button>
        <p>{ transcript ? <p>{transcript}</p> : null }</p>
    </div>
  )
}

export default Transcript