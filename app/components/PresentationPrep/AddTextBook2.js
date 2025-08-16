import React, { useEffect, useState, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { TextbookImageThumb } from "@app/components/PresentationPrep/TextbookImageThumb";
import { useLessonStore } from "@app/stores/UseLessonStore";
import { deleteFile, getFile } from "@app/utils/IndexedDBWrapper";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import { base64ToBlob } from "@app/utils/base64ToBlob";
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
} from "@app/utils/AddTextBookUtil_CSS";

function AddTextBook({ category, stageID }) {
  const {
    textbook,
    questions,
    answers,
    updateTextbook,
    updateQuestions,
    updateAnswers,
    updateTextbookTranscript,
  } = useContext(ReadingForGistAndDetailContext);

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

  const [files, setFiles] = useState([]);

  // Robust preview logic: always sync preview with IndexedDB after save
  useEffect(() => {
    const imagePath = completeListeningStageData?.[`${category}ImageData`];
    if (!imagePath) return;

    getFile(imagePath).then((data) => {
      if (typeof data === "string" && data.startsWith("data:image")) {
        const blob = base64ToBlob(data);
        setFiles([
          {
            name: imagePath,
            preview: URL.createObjectURL(blob),
          },
        ]);
      } else if (data && data instanceof Blob) {
        setFiles([
          {
            name: imagePath,
            preview: URL.createObjectURL(data),
          },
        ]);
      } else {
        setFiles([]);
      }
    });

    return () => {
      setFiles((prev) => {
        prev.forEach((file) => URL.revokeObjectURL(file.preview));
        return [];
      });
    };
  }, [category, completeListeningStageData]);

  // OCR logic
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
    switch (category) {
      case "BookText":
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
        return null;
    }
  }

  // Save image to IndexedDB and update Zustand, then reload preview from IndexedDB
  const saveTextBookData = async (
    userID,
    lessonId,
    stageID,
    category,
    file
  ) => {
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`;
    updateCompleteListeningStageData({
      ...completeListeningStageData,
      [`${category}ImageData`]: filePath,
    });
    await saveImageToIndexedDB(filePath, file);

    // After save, reload from IndexedDB for robust preview
    const storedFile = await getFile(filePath);
    if (storedFile && storedFile instanceof Blob) {
      setFiles([
        {
          name: filePath,
          preview: URL.createObjectURL(storedFile),
        },
      ]);
    }
  };

  // Dropzone logic
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: false,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Show preview immediately
        setFiles([
          {
            name: file.name,
            preview: URL.createObjectURL(file),
          },
        ]);

        // OCR and save
        const reader = new FileReader();
        reader.onload = () => {
          handleReadText(reader.result, file);
        };
        reader.readAsDataURL(file);

        saveTextBookData(userID, lessonId, stageID, category, file);
      },
    });

  // Delete image logic
  const handleDeleteImage = async (file) => {
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`;
    await deleteFile(filePath);

    updateCompleteListeningStageData({
      ...completeListeningStageData,
      [`${category}ImageData`]: undefined,
    });
    handleTextStateMemory("");
    setFiles((prev) => prev.filter((f) => f.name !== file.name));
  };

  // Thumbnails
  const thumbs = files.map((file) => (
    <TextbookImageThumb
      key={file.name}
      file={file}
      onDelete={handleDeleteImage}
    />
  ));

  // Styles
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  // Text display
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

  // Button display
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
        return null;
    }
  };

  async function handleClick() {
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
