import { useContext } from "react";
import { AudioTextContext } from "../contexts/AudioTextContext";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useLessonStore } from "@app/stores/useLessonStore";
import { getFile } from "@app/utils/IndexedDBWrapper";
const GetAudioTranscript = () => {
  const {
    updateTranscript,
    transcript,
    updateS2tData,

    //wordTimeArray,
    //updateWordTimeArray,
  } = useContext(AudioTextContext);

  const selectedAudioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );

  const updateS2TAudioTranscript = useLessonStore(
    (state) => state.updateS2TAudioTranscript,
  );

  const updateWordTimeArray = useLessonStore(
    (state) => state.updateWordTimeArray,
  );
  const s2TAudioTranscript = useLessonStore(
    (state) => state.s2TAudioTranscript,
  );
  const completeListeningStageData = useLessonStore(
    (state) => state.completeListeningStageData,
  );

  const wordTimeArray = useLessonStore((state) => state.wordTimeArray);

  async function getTranscript() {
    console.log("STORE selectedAudioFileName:", selectedAudioFileName);
    const response = await fetch(
      `/api/google-api-s2t?name=${selectedAudioFileName}`,
    );
    //const response = await fetch(`/api/test`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    updateS2tData(data);
    createTimeArray(data);
    // Update Zustand store with the S2T audio transcript
    updateS2TAudioTranscript(data);

    const combinedTranscript = data
      .map((element) => {
        return element.alternatives[0].transcript;
      })
      .join(" ");
    console.log(combinedTranscript);

    updateTranscript(combinedTranscript);
    updateS2TAudioTranscript(combinedTranscript);
  }

  function createTimeArray(text) {
    const wordsInfo = text[text.length - 1].alternatives[0].words;
    updateWordTimeArray(wordsInfo);
    console.log("⏳ Word Time array created:");

    console.log(JSON.stringify(wordsInfo));
  }
  return (
    <div>
      <button onClick={getTranscript}>Get Transcript</button>
      <p>{s2TAudioTranscript ? s2TAudioTranscript : null}</p>
      {/* <p>{wordTimeArray ? <p>{JSON.stringify(wordTimeArray)}</p> : null}</p> */}
    </div>
  );
};

export default GetAudioTranscript;
