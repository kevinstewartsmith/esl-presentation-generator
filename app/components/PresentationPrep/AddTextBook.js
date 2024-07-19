import React, { useEffect, useState, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { PresentationContext } from "@app/contexts/PresentationContext";

// Styles
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  // backgroundColor: '#fafafa',
  backgroundColor: "#f5f5f5",
  color: "#bdbdbd",
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
  width: "auto",
  height: "100%",
};

const buttonStyle = {
  backgroundColor: "blue",
  color: "white",
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: "black",
};

function AddTextBook({ category }) {
  console.log("The category is: ", category);
  const [extractedText, setExtractedText] = useState("");
  const {
    textTranscript,
    updateTextTranscript,
    questions,
    updateQuestions,
    answers,
    updateAnswers,
  } = useContext(PresentationContext);

  //OCR Function
  async function handleReadText2(file) {
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(file);
    //setExtractedText(text);
    updateTextTranscript(text);
    await worker.terminate();
  }

  async function handleReadText(file) {
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(file);
    //setExtractedText(text);
    //updateTextTranscript(text);
    handleTextStateMemory(text);
    await worker.terminate();
  }

  function handleTextStateMemory(text) {
    console.log("The category is SWITCH: ", category);
    switch (category) {
      case "BookText":
        updateTextTranscript(text);
        return null;
      case "QuestionText":
        updateQuestions(text);
        return null;
      case "AnswerText":
        updateAnswers(text);
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

  const handleTextDisplay = (category, textTranscript, questions, answers) => {
    switch (category) {
      case "BookText":
        return <h1 style={{ color: "black" }}>{textTranscript}</h1>;
      case "QuestionText":
        return <h1 style={{ color: "black" }}>{questions}</h1>;
      case "AnswerText":
        return <h1 style={{ color: "black" }}>{answers}</h1>;
      default:
        console.log("No category selected");
        return null;
    }
  };

  const handleButtonDisplay = (category) => {
    switch (category) {
      case "BookText":
        return (
          <button style={buttonStyle} onClick={handleClick}>
            Clean Text
          </button>
        );
      case "QuestionText":
        return (
          <button style={buttonStyle} onClick={handleClick}>
            Clean Questions
          </button>
        );
      case "AnswerText":
        return (
          <button style={buttonStyle} onClick={handleClick}>
            Clean Answers
          </button>
        );
      default:
        console.log("No category selected");
        return null;
    }
  };

  async function handleClick() {
    console.log("HANDLECLICK The category is: ", category);
    const textContent = (category) => {
      switch (category) {
        case "BookText":
          return textTranscript;
        case "QuestionText":
          return questions;
        case "AnswerText":
          return answers;
        default:
          return "No category selected";
      }
    };
    const text = textContent(category);
    console.log("The category is: ", category);
    console.log("The text content is: ", text);
    console.log("the text is: ", text);
    const response = await fetch(
      `/api/clean-text-json?query=${text}&category=${category}`
    );
    const data = await response.json();
    console.log(data);
    console.log(typeof data);
  }

  return (
    <section
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderWidth: 2,
          borderRadius: 10,
          width: "66vw",
          boxShadow: 50,
          padding: 10,
        }}
      >
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>{thumbs}</aside>
        <div style={{ borderWidth: 1 }}>
          {handleTextDisplay(category, textTranscript, questions, answers)}
        </div>
        {/* <button style={buttonStyle}>Clean Questions</button> */}
        {handleButtonDisplay(category)}
      </div>
    </section>
  );
}

export default AddTextBook;
