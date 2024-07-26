import {useContext, useEffect, useState, useRef} from 'react'
import { AudioTextContext } from '@app/contexts/AudioTextContext'

const Snippet = ({snippet, index}) => {
    const audioContextRef = useRef(null);
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

    const playButtonPressed = () => {

        if (snippetBufferArray[index]) {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = snippetBufferArray[index];
          source.connect(audioContextRef.current.destination);
          source.start();
        }
      };

    const playSnippet = (e) => {
        e.preventDefault();
        console.log("play snippet", e.target.value)
        const snippet = snippetBufferArray[e.target.value]
        if (snippet) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = snippet;
            source.connect(audioContextRef.current.destination);
            source.start();
        }
    }

    useEffect(() => {
        // Create AudioContext only if it hasn't been created yet
        if (!audioContextRef.current) {
          window.AudioContext = window.AudioContext ;
          audioContextRef.current = new AudioContext();
        }
        async function fetchAudioFile(audioURL) {
            try {
                const response = await fetch(audioURL);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                updateAudioBuffer(buffer);
            } catch (error) {
                console.error('Error fetching or decoding audio file:', error);
            }
        }
        fetchAudioFile(audioURL);  

    }, [snippetBufferArray]); 

    return (
        <>  
            <div key={index}>
                <button onClick={playSnippet} value={index}>PLAY SNIPPET</button>
                <h1>Snippet {index}</h1>
                <h1>Start: {snippetTimeStamps[index].start}</h1>
                <h1>End: {snippetTimeStamps[index].end}</h1>
            </div>
        </>
    )
}

export default Snippet