import React, { useContext, useState, Fragment } from "react";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import { Grid } from "@mui/material";
import { createWorker } from "tesseract.js";

const ListeningUploadQuestions = () => {
  const {
    originalAudio,
    setAudioSnippet,
    updateExtractedText,
    extractedText,
    updateQuestions,
    questions,
    updateTranscript,
    transcript,
    updateS2tData,
    s2tData,
    updateSnippetData,
    snippetData,
    bucketContents,
    updateBucketContents,
    selectedAudioFileName,
  } = useContext(AudioTextContext);

  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(URL.createObjectURL(selectedImage));
  };

  async function handleReadText() {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(image);
    console.log(ret.data.text);
    //setTextOCR(ret.data.text);
    updateExtractedText(ret.data.text);
    await worker.terminate();
  }
  return (
    <Grid container direction={"row"} spacing={2} padding={20}>
      <Grid item xs={12} sm={6}>
        <input type="file" onChange={handleImageChange} />
        {image && (
          <img src={image} alt="Uploaded" style={{ maxWidth: "300px" }} />
        )}
        {/* //text forn for title and subit button */}
        <br></br>
        <button
          onClick={handleReadText}
          style={{ borderWidth: "2px", borderColor: "white" }}
        >
          Read Text
        </button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container direction={"row"} spacing={2} padding={20}>
          <Grid item xs={12} sm={6}></Grid>
          <div>
            <h1>Extracted Text</h1>
            <pre>
              {/* {textOCR.split('\n').map((line, index) => ( */}
              {extractedText
                ? extractedText.split("\n").map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      <br />
                    </Fragment>
                  ))
                : null}
            </pre>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListeningUploadQuestions;
