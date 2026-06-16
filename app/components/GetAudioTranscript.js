import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const GetAudioTranscript = () => {
  const selectedAudioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );
  const updateS2tTranscript = useAudioTextStore(
    (state) => state.updateS2tTranscript,
  );
  const updateWordTimeArray = useAudioTextStore(
    (state) => state.updateWordTimeArray,
  );
  const s2tTranscript = useAudioTextStore((state) => state.s2tTranscript);
  const wordTimeArray = useAudioTextStore((state) => state.wordTimeArray);

  async function getTranscript() {
    console.log("STORE selectedAudioFileName:", selectedAudioFileName);
    const response = await fetch(
      `/api/google-api-s2t?name=${selectedAudioFileName}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    createTimeArray(data);

    const combinedTranscript = data
      .map((element) => element.alternatives[0].transcript)
      .join(" ");
    console.log(combinedTranscript);

    updateS2tTranscript(combinedTranscript);
  }

  function createTimeArray(data) {
    const wordsInfo = data[data.length - 1].alternatives[0].words;
    updateWordTimeArray(wordsInfo);
    console.log("⏳ Word Time array created:");
    console.log(JSON.stringify(wordsInfo));
  }

  return (
    <div>
      <button onClick={getTranscript}>Get Transcript</button>
      <p>{s2tTranscript ? s2tTranscript : null}</p>
      {/* <p>{wordTimeArray ? <p>{JSON.stringify(wordTimeArray)}</p> : null}</p> */}
    </div>
  );
};

export default GetAudioTranscript;
