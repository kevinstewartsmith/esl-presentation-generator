import React, { useEffect, useState, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { PresentationContext } from "@app/contexts/PresentationContext";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import { AudioTextContext } from "@app/contexts/AudioTextContext";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { useLessonStore } from "@app/stores/UseLessonStore";
//import { read } from "fs";

// Styles
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#f5f5f5",
  color: "#bdbdbd",
  //color: "green",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "10vh",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  backgroundColor: "white",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain", // Ensures that the image fits within its container while maintaining its aspect ratio
};

function AddTextBook({ category, stageID }) {
  console.log("The category is: ", category);
  //const [extractedText, setExtractedText] = useState("");
  const {
    textTranscript,
    updateTextTranscript,
    //questions,
    //updateQuestions,
    //answers,
    //updateAnswers,
    updateTextBoxInputs,
  } = useContext(PresentationContext);

  const {
    textbook,
    questions,
    answers,
    updateTextbook,
    updateQuestions,
    updateAnswers,
    updateTextbookTranscript,
  } = useContext(ReadingForGistAndDetailContext);

  //Audio Questions and Answers for useLessonStore
  const audioQuestions = useLessonStore((state) => state.audioQuestions);
  const updateAudioQuestions = useLessonStore(
    (state) => state.updateAudioQuestions
  );
  const audioAnswers = useLessonStore((state) => state.audioAnswers);
  const updateAudioAnswers = useLessonStore(
    (state) => state.updateAudioAnswers
  );
  const audioTranscript = useLessonStore((state) => state.audioTranscript);
  const updateAudioTranscript = useLessonStore(
    (state) => state.updateAudioTranscript
  );
  //Reads the text from the image
  async function handleReadText(file) {
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(file);
    handleTextStateMemory(text);
    await worker.terminate();
  }

  function handleTextStateMemory(text) {
    console.log("The category is SWITCH: ", category);
    switch (category) {
      case "BookText":
        //updateTextTranscript(text);
        updateTextbook(text);
        // updateTextbook((prevState) => ({
        //   ...prevState, // Spread the previous state
        //   transcript: text, // Update the transcript
        // }));

        return null;
      case "QuestionText":
        updateQuestions(text);
        // updateQuestions((prevState) => ({
        //   ...prevState, // Spread the previous state
        //   transcript: text, // Update the transcript
        // }));
        return null;
      case "AnswerText":
        updateAnswers(text);

        return null;
      case "ListeningQuestionText":
        updateAudioQuestions(text);
        return null;
      case "ListeningAnswersText":
        updateAudioAnswers(text);
        return null;
      case "ListeningTranscript":
        updateAudioTranscript(text);
        return null;
      default:
        console.log("No category selected");
        return null;
    }
  }

  const [files, setFiles] = useState([]);

  //Drag and Drop
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: false,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            handleReadText(reader.result);
          };
          reader.readAsDataURL(file);
        });
      },
    });

  //Thumbnails
  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  //Styles Memo
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleTextDisplay = (category, textbook, questions, answers) => {
    switch (category) {
      case "BookText":
        return <h1 style={{ color: "black" }}>{textbook}</h1>;
      case "QuestionText":
        return <h1 style={{ color: "black" }}>{questions}</h1>;
      case "AnswerText":
        return <h1 style={{ color: "black" }}>{answers}</h1>;
      case "ListeningQuestionText":
        return <h1 style={{ color: "black" }}>{audioQuestions}</h1>;
      case "ListeningAnswersText":
        return <h1 style={{ color: "black" }}>{audioAnswers}</h1>;
      case "ListeningTranscript":
        return <h1 style={{ color: "black" }}>{audioTranscript}</h1>;
      default:
        //console.log("No category selected");
        return null;
    }
  };

  const handleButtonDisplay = (category) => {
    switch (category) {
      case "BookText":
        return <button onClick={handleClick}>Clean Text</button>;
      case "QuestionText":
        return <button onClick={handleClick}>Clean Questions</button>;
      case "AnswerText":
        return <button onClick={handleClick}>Clean Answers</button>;
      case "ListeningQuestionText":
        return <button onClick={handleClick}>Clean Audio Questions</button>;
      case "ListeningAnswersText":
        return <button onClick={handleClick}>Clean Audio Answers</button>;
      case "ListeningTranscript":
        return <button onClick={handleClick}>Clean Audio Transcript</button>;

      default:
        //console.log("No category selected");
        return null;
    }
  };

  async function handleClick() {
    //console.log("HANDLECLICK The category is: ", category);
    const textContent = (category) => {
      switch (category) {
        case "BookText":
          return textbook;
        case "QuestionText":
          return questions;
        case "AnswerText":
          return answers;
        case "ListeningQuestionText":
          return audioQuestions;
        case "ListeningAnswersText":
          return audioAnswers;
        case "ListeningTranscript":
          return audioTranscript;
        default:
          return "No category selected";
      }
    };
    const text = textContent(category);

    const response = await fetch(
      `/api/clean-text-json?query=${text}&category=${category}`
    );
    const data = await response.json();

    // updatetext so that key textEdits hold the value [...text, textEdits: data]
    console.log("The data is: ", data);
    updateTextbookTranscript(data);
  }

  const dragNDropText = (category) => {
    switch (category) {
      case "BookText":
        return "Book Text";
      case "QuestionText":
        return "QUESTION Text";
      case "AnswerText":
        return "ANSWER Text";
      case "ListeningQuestionText":
        return "Audio QUESTIONS";
      case "ListeningAnswersText":
        return "Audio ANSWERS";
      case "ListeningTranscript":
        return "Audio TRANSCRIPT";
      default:
        return "No category selected";
    }
  };

  return (
    <section
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderWidth: 2,
          borderRadius: 10,
          width: "66vw",
          boxShadow: 50,
          padding: "2%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        {/* <InputWithIcon label={"Page"} input={"page"} /> */}
        <TextBookInfoEntry
          category={category}
          className="w-half"
          stageID={stageID}
        />
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>
            Drag <strong>{dragNDropText(category)}</strong>, or click to select
            files
          </p>
        </div>
        <aside style={thumbsContainer}>{thumbs}</aside>
        <div style={{ borderWidth: 1 }}>
          {handleTextDisplay(category, textbook, questions, answers)}
        </div>
        {/* <button style={buttonStyle}>Clean Questions</button> */}
        {handleButtonDisplay(category)}
      </div>
    </section>
  );
}

export default AddTextBook;
