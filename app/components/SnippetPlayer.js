import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useEffect, useRef, useContext } from 'react';
import { AudioTextContext } from '@app/contexts/AudioTextContext';
import { combinedTranscript } from '@app/utils/transcript';
import { createAudioSlice } from '@app/utils/AudioSnipper'
import { playAudioFile, playAudioFileClip } from '@app/utils/AudioControls';


function SnippetPlayer({ index }) {
    const { snippetData, wordTimeArray, transcript, fullAudioBuffer, selectedAudioFileName } = useContext(AudioTextContext)
    const audioURL = "/api/audio"
    const audioContextRef = useRef(null);

    function findSnippetIndices(snippet, array) {
        const snippetWords = snippet.split(' ');
        const indices = [];
      
        for (let i = 0; i <= array.length - snippetWords.length; i++) {
          let match = true;
      
          for (let j = 0; j < snippetWords.length; j++) {
            if (array[i + j] !== snippetWords[j]) {
              match = false;
              break;
            }
          }
      
          if (match) {
            indices.push({ start: i, end: i + snippetWords.length - 1 });
          }
        }
      
        return indices;
      }
      
      // Test the function
      const array = ["unit",10,"page",95,"listening","exercises","eight","and","nine","","hey","Connor","what","are","you","doing","this","weekend","hi","I'm","quite","busy","actually","why","well","it's","just","that","we've","got","that","history","test","coming","up","do","you","want","to","study","together","that","would","be","great","but","let","me","see","Saturday","morning","is","no","good","I'm","playing","football","it's","the","cup","final","and","I","can't","miss","that","of","course","not","okay","so","what","about","Friday","night","I'm","sorry","I","can't","I'm","busy","dad's","taking","me","to","the","sports","centre","to","watch","the","basketball","game","but","it","doesn't","finish","until","10:00","p.m.","yeah","that's","a","bit","late","okay","how","about","Saturday","afternoon","any","chance","","Saturday","afternoon","Saturday","afternoon","it's","my","brother's","birthday","so","we're","going","to","the","restaurant","to","celebrate","you","know","that","new","American","diner","on","the","High","Street","oh","yeah","I've","heard","it's","very","good","what","time","do","you","think","you're","finished","there","probably","about","5:00","p.m.","but","then","I'm","meeting","Nathan","we're","going","to","see","the","new","Spider-Man","film","at","the","cinema","hey","would","you","like","to","come","Spider-Man","not","really","my","thing","so","thanks","but","no","thanks","I","guess","that","just","leaves","Sunday","yeah","Sunday","hmm","","that's","a","problem","too","why","well","my","grandparents","are","coming","over","and","we're","taking","them","to","that","outdoor","Museum","oh","the","one","with","all","the","cool","old","buildings","that's","right","my","granddad","loves","that","sort","of","stuff","I'd","invite","you","but","I'm","really","sorry","we","haven't","got","any","room","in","the","car","I","don't","want","to","see","old","buildings","Connor","I","want","to","study","for","the","test","you","have","of","course","Sunday","evening","maybe","but","only","after","8:00","p.m.","I've","got","a","piano","lesson","from","seven","to","eight","and","we","won't","be","back","from","the","museum","much","before","6:00","p.m.","no","that's","too","late","what","about","next","weekend","I've","got","loads","of","free","time","next","weekend","I'd","love","to","but","there's","a","problem","what's","that","the","test","is","on","Monday","this","Monday","first","thing","in","the","morning"];
      
    //   const snippet = "I'm playing football it's the cup final and I can't miss that of course not okay";
    //   const indices = findSnippetIndices(snippet, array);
    //   console.log(indices); // Output: [{ start: 62, end: 82 }]
      
      //pretty sure i'm not using this
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

        }, [audioURL, 
            //snippetBufferArray
        ]); 

        
    function playSnippetClicked() {
        
        console.log(typeof index);
        console.log(snippetData[index].snippet);
        const transcriptArray = transcript.split(" ")
        const transcriptArray2 = removeEmptyStrings(transcriptArray)
        console.log("Transcript Array 1: " + transcriptArray.length);
        console.log("Transcript Array 2: " + transcriptArray2.length);
        console.log(transcriptArray2);
        console.log(wordTimeArray);
        console.log("Transcript 2: " + transcriptArray2.length );
        console.log("Word array length: " + wordTimeArray.length);
        
        const snippet = snippetData[index].snippet
        const indeces = findSnippetIndices(snippet,transcriptArray2)
        console.log(indeces);
        const startIndex = indeces[0].start
        const endIndex = indeces[0].end
        const slicedArray = transcriptArray2.slice(startIndex, endIndex + 1);
        console.log(slicedArray);
        console.log(typeof startIndex);
       // console.log(slicedArray.join(' '));
        console.log(wordTimeArray[startIndex]);
        console.log(wordTimeArray[endIndex]);
        // console.log(wordTimeArray[startIndex].startTime);
        // console.log(wordTimeArray[endIndex].endTime);
        const startTime = wordTimeArray[startIndex].startTime
        const endTime = wordTimeArray[endIndex].endTime
        console.log(startTime);
        playSnippet(selectedAudioFileName, startTime, endTime)
    }
    function getTimeStamp(data) {
        //const data = {seconds: '19', nanos: 200000000};
        // Convert seconds to float
        const secondsFloat = data.seconds !== null ? parseFloat(data.seconds) : 0

        // Convert nanos to float and adjust for decimal precision
        const nanosFloat = data.nanos !== null ? parseFloat(data.nanos) / Math.pow(10, 9) : 0

        // Combine seconds and nanos
        const resultFloat = secondsFloat + nanosFloat;

        console.log(resultFloat); // Output: 19.2
        return resultFloat
    }

    async function playSnippet(name, startTime, endTime) {
            const start = getTimeStamp(startTime)
            const end = getTimeStamp(endTime)
            console.log(start);
            console.log(end);
            // if (!fullAudioBuffer) return ;
        
            // const audioContext = new AudioContext();
            // audioContext.decodeAudioData(fullAudioBuffer, (buffer) => {
            //   const source = audioContext.createBufferSource();
            //   source.buffer = buffer;
            //   source.connect(audioContext.destination);
            //   source.start();
            // });
            console.log(startTime);
            console.log(startTime.seconds);
            console.log(startTime.nanos % 1000000000);
            console.log(endTime);

            console.log('Row Data:', name);
            try {
                const response = await fetch(`/api/audio?name=${name}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch audio file');
                }
                
                const audioBuffer = await response.arrayBuffer();
                //playAudioFile(audioBuffer)
                playAudioFileClip(audioBuffer, start, end)
                // const audioContext = new AudioContext();
                // const audioSource = audioContext.createBufferSource();
                // audioContext.decodeAudioData(audioBuffer, (buffer) => {
                //     audioSource.buffer = buffer;
                //     audioSource.connect(audioContext.destination);
                //     audioSource.start(0);
                // });
            } catch (error) {
                console.error('Error playing audio:', error);
            }
          
    }

    function removeEmptyStrings(array) {
        return array.filter(item => item !== "");
    }


    return (
        <div style={{ backgroundColor: "transparent", width: "100px", height: "100%", display: "flex", alignItems:"center", justifyContent:"center" }} onClick={playSnippetClicked} value={index}>
            <PlayCircleFilledWhiteIcon style={{ width: "100%", height: "100%" }} />
        </div>
    )
}

export default SnippetPlayer