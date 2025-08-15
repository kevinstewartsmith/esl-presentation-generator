import React, { useEffect, useState, useMemo, useContext, use } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { TextbookImageThumb } from "@app/components/PresentationPrep/TextbookImageThumb";
import { useLessonStore } from "@app/stores/UseLessonStore";
import { deleteFile } from "@app/utils/IndexedDBWrapper";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import {
  saveImageToIndexedDB,
  dragNDropText,
} from "@app/utils/AddTextBookUtil";

import {
  baseStyle,
  focusedStyle,
  acceptStyle,
  rejectStyle,
  thumbsContainer,
  thumb,
  thumbInner,
  img,
} from "@app/utils/AddTextBookUtil_CSS";

function AddTextBook({ category, stageID }) {
  console.log("The category is: ", category);

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
  const userID = useLessonStore((state) => state.currentUserID);
  const lessonId = useLessonStore((state) => state.currentLessonID);
  const updateCompleteListeningStageData = useLessonStore(
    (state) => state.updateCompleteListeningStageData
  );
  const completeListeningStageData = useLessonStore(
    (state) => state.completeListeningStageData
  );

  useEffect(() => {
    const fetchData = async () => {
      const encodedStageID = encodeURIComponent(listeningForGistandDetailStage);
      const res = await fetch(
        `/api/firestore/section-data/post-section-data?userID=${currentUserID}&lessonID=${currentLessonID}&stageID=${encodedStageID}`
      );
      const json = await res.json();
      useLessonStore.getState().setHydratedThinkPhase(json?.ThinkPhase || []);
    };

    fetchData();
  }, []);

  //Reads the text from the image
  async function handleReadText(base64File, file) {
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(base64File);
    handleTextStateMemory(text, file);
    await worker.terminate();
  }

  function handleTextStateMemory(text) {
    console.log("The category is SWITCH: ", category);
    switch (category) {
      case "BookText":
        //updateTextTranscript(text);
        updateTextbook(text);
        return null;
      case "QuestionText":
        updateQuestions(text);
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
            handleReadText(reader.result, file);
          };
          reader.readAsDataURL(file);

          saveTextBookData(userID, lessonId, stageID, category, file);
        });
      },
    });

  //Delete Image
  const handleDeleteImage = async (file) => {
    console.log("Delete Image and data.");
    // 1. Remove from IndexedDB
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`;
    await deleteFile(filePath);

    // 2. Remove filepath from completeListeningStageData
    updateCompleteListeningStageData({
      ...completeListeningStageData,
      [`${category}ImageData`]: undefined, // or null, or delete the key as needed
    });
    // 3. Remove from files state
    handleTextStateMemory("");

    // 4. Remove from files state (removes preview)
    setFiles((prev) => prev.filter((f) => f.name !== file.name));
  };
  //Textbook Image Thumbnails
  const thumbs = files.map((file) => (
    <TextbookImageThumb
      key={file.name}
      file={file}
      onDelete={handleDeleteImage}
    />
  ));

  //Saves audio file name to lessonstore and sends audio file to Firestore
  const saveTextBookData = async (
    userID,
    lessonId,
    stageID,
    category,
    file
  ) => {
    const fileName = file.name;
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`; // Handle both path and name
    // Save audio file name to lesson store
    updateCompleteListeningStageData({
      ...completeListeningStageData,
      [`${category}ImageData`]: filePath,
    });
    saveImageToIndexedDB(filePath, file);
  };

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

        {handleButtonDisplay(category)}
      </div>
    </section>
  );
}

export default AddTextBook;
