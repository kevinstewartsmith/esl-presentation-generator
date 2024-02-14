import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useEffect } from 'react';

function SnippetPlayer({ index }) {

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

        }, [audioURL, snippetBufferArray]); 

        
    function playSnippetClicked() {
        
        console.log(index);
    }

    return (
        <div style={{ backgroundColor: "transparent", width: "100px", height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }} onClick={playSnippetClicked} value={index}>
            <PlayCircleFilledWhiteIcon style={{ width: "100%", height: "100%" }} />
        </div>
    )
}

export default SnippetPlayer