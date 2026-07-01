import React, { useEffect, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import TextBookInfoEntry from "@app/components/PresentationPrep/TextBookInfoEntry";
import { TextbookImageThumb } from "@app/components/PresentationPrep/TextbookImageThumb";
import { useLessonStore } from "@app/stores/useLessonStore";
import { deleteFile, getFile } from "@app/utils/IndexedDBWrapper";
import {
  listeningForGistandDetailStage,
  readingForGistandDetailStage,
} from "@app/utils/SectionIDs";
import { base64ToBlob } from "@app/utils/base64ToBlob";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

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
  const textbook = useReadingStore((state) => state.textbook);
  const questions = useReadingStore((state) => state.questions);
  const answers = useReadingStore((state) => state.answers);
  const updateTextbook = useReadingStore((state) => state.updateTextbook);
  const updateQuestions = useReadingStore((state) => state.updateQuestions);
  const updateAnswers = useReadingStore((state) => state.updateAnswers);
  const updateTextbookTranscript = useReadingStore(
    (state) => state.updateTextbookTranscript,
  );

  // Audio text for useAudioTextStore
  const audioQuestions = useAudioTextStore((state) => state.audioQuestions);
  const updateAudioQuestions = useAudioTextStore(
    (state) => state.updateAudioQuestions,
  );
  const audioAnswers = useAudioTextStore((state) => state.audioAnswers);
  const updateAudioAnswers = useAudioTextStore(
    (state) => state.updateAudioAnswers,
  );
  const audioTranscript = useAudioTextStore((state) => state.ocrTranscript);
  const updateAudioTranscript = useAudioTextStore(
    (state) => state.updateOcrTranscript,
  );

  // ---- Stage-agnostic image-path store selection ----
  // Both stores expose identically-named imagePathsByCategory + updateImagePathForCategory.
  // Select from all unconditionally (hook-rules), then pick by stageID.
  // Adding a stage (e.g. Vocabulary) = add its two selectors + one registry line.
  const audioImagePaths = useAudioTextStore((s) => s.imagePathsByCategory);
  const audioUpdateImagePath = useAudioTextStore(
    (s) => s.updateImagePathForCategory,
  );
  const readingImagePaths = useReadingStore((s) => s.imagePathsByCategory);
  const readingUpdateImagePath = useReadingStore(
    (s) => s.updateImagePathForCategory,
  );

  const IMAGE_STORE_BY_STAGE = {
    [listeningForGistandDetailStage]: {
      paths: audioImagePaths,
      update: audioUpdateImagePath,
    },
    [readingForGistandDetailStage]: {
      paths: readingImagePaths,
      update: readingUpdateImagePath,
    },
  };
  const { paths: imagePathsByCategory, update: updateImagePathForCategory } =
    IMAGE_STORE_BY_STAGE[stageID] ??
    IMAGE_STORE_BY_STAGE[readingForGistandDetailStage];

  const userID = useLessonStore((state) => state.currentUserID);
  const lessonId = useLessonStore((state) => state.currentLessonID);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const imagePath = imagePathsByCategory?.[category];

    if (!imagePath) {
      setFiles([]);
      return;
    }

    let cancelled = false;
    let createdPreview = null;

    getFile(imagePath).then((data) => {
      if (cancelled) return;
      let preview = null;
      if (typeof data === "string" && data.startsWith("data:image")) {
        preview = URL.createObjectURL(base64ToBlob(data));
      } else if (data && data instanceof Blob) {
        preview = URL.createObjectURL(data);
      }
      if (preview) {
        createdPreview = preview;
        setFiles([{ name: imagePath, preview }]);
      }
    });

    return () => {
      cancelled = true;
      if (createdPreview) URL.revokeObjectURL(createdPreview);
    };
  }, [category, imagePathsByCategory?.[category]]);

  // Reads the text from the image
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
        console.log("No category selected");
        return null;
    }
  }

  // Drag and Drop
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
            }),
          ),
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

  // Delete Image
  const handleDeleteImage = async (file) => {
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`;
    await deleteFile(filePath);

    updateImagePathForCategory(category, "");

    handleTextStateMemory("");

    setFiles((prev) => prev.filter((f) => f.name !== file.name));
  };

  // Textbook Image Thumbnails
  const thumbs = files.map((file) => (
    <TextbookImageThumb
      key={file.name}
      file={file}
      onDelete={handleDeleteImage}
    />
  ));

  const saveTextBookData = async (
    userID,
    lessonId,
    stageID,
    category,
    file,
  ) => {
    const encodedStageID = encodeURIComponent(stageID);
    const filePath = `${userID}_${lessonId}_${encodedStageID}_${category}_${file.name}`;
    updateImagePathForCategory(category, filePath);
    saveImageToIndexedDB(filePath, file);
  };

  // Styles Memo
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
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
      `/api/clean-text-json?query=${text}&category=${category}`,
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
