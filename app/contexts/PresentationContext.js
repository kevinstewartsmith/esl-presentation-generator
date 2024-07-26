"use client";
// audioContext.js
import { createContext, useState, useEffect } from "react";

const PresentationContext = createContext();

const PresentationContextProvider = ({ children }) => {
  const [showPresentation, setShowPresentation] = useState(false);

  // Presentation Details
  const [textTranscript, setTextTranscript] = useState("");
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();
  const [vocabulary, setVocabulary] = useState();
  const [gistReadingQuestions, setGistReadingQuestions] = useState("");
  const [gistReadingAnswers, setGistReadingAnswers] = useState("");
  const [gistReadingPage, setGistReadingPage] = useState("");
  const [textbookExercises, setTextbookExercises] = useState();
  const [discussionObjects, setDiscussionObjects] = useState([]);
  const [textbookExercisePages, setTextbookExercisePages] = useState();

  // Discussion forms state
  const [discussionForms, setDiscussionForms] = useState({});

  // Slider state
  const [sliders, setSliders] = useState({});

  //Section and subsection inclusion state
  //const [included, setIncluded] = useState({"id": true});
  const [included, setIncluded] = useState({});
  const [textBoxInputs, setTextBoxInputs] = useState({});

  //console.log(typeof discussionForms);
  //console.log(discussionForms);

  function updateTextTranscript(newTextTranscript) {
    setTextTranscript(newTextTranscript);
  }

  function updateQuestions(newQuestions) {
    setQuestions(newQuestions);
  }

  function updateAnswers(newAnswers) {
    setAnswers(newAnswers);
  }

  function updateVocabulary(newVocabulary) {
    setVocabulary(newVocabulary);
  }

  function loadVocabulary(data) {
    // Add the fields selected: false and img_url: null to each word object
    const words = data.map((word) => {
      return {
        ...word,
        selected: false,
        img_url: "",
      };
    });
    console.log(words);
    setVocabulary(words);
  }

  function updateGistReadingQuestions(newGistReadingQuestions) {
    setGistReadingQuestions(newGistReadingQuestions);
    console.log(gistReadingQuestions);
  }

  function updateGistReadingAnswers(newGistReadingAnswers) {
    setGistReadingAnswers(newGistReadingAnswers);
    console.log(gistReadingAnswers);
  }

  function updateGistReadingPage(newGistReadingPage) {
    setGistReadingPage(newGistReadingPage);
    console.log(gistReadingPage);
  }

  function updateTextbookExercises(newTextbookExercises) {
    setTextbookExercises(newTextbookExercises);
  }

  //Discussion form functions
  function updateDiscussionObjects(newDiscussionObjects) {
    setDiscussionObjects(newDiscussionObjects);
  }

  const addDiscussionLine = (id) => {
    setDiscussionForms((prev) => {
      const form = prev[id] || {
        numberOfDiscussionLines: 0,
        discussionTexts: [],
      };
      return {
        ...prev,
        [id]: {
          ...form,
          numberOfDiscussionLines: form.numberOfDiscussionLines + 1,
          discussionTexts: [...form.discussionTexts, ""],
        },
      };
    });
  };

  function updateDiscussionText(id, index, text) {
    console.log("updateDiscussionText");
    setDiscussionForms((prev) => {
      const form = prev[id] || { discussionTexts: [] };
      const newTexts = [...form.discussionTexts];
      newTexts[index] = text;
      return {
        ...prev,
        [id]: {
          ...form,
          discussionTexts: newTexts,
        },
      };
    });
  }

  function addSliderStateMemory(id, min, max, defaultValue, label) {
    setSliders((prev) => {
      const slider = prev[id] || {
        min: min,
        max: max,
        defaultValue: defaultValue,
        label: label,
        value: defaultValue,
      };
      return {
        ...prev,
        [id]: slider,
      };
    });
    console.log("sliders CONTEXT: " + JSON.stringify(sliders));
  }
  //this is wrong
  function updateSliderStateMemory(id, newValue) {
    setSliders((prev) => {
      const slider = prev[id] || {
        min: 0,
        max: 10,
        defaultValue: 3,
        label: "Time Limit",
      };
      return {
        ...prev,
        [id]: { ...slider, value: newValue },
      };
    });

    console.log(JSON.stringify(sliders));
  }

  function updateIncludedSection(id) {
    console.log("updateIncludedSectionCONTEXT: " + id);
    //check if the id is already in the included object
    //if it is, switch the boolean value
    //if it is not, add it with a value of true
    setIncluded((prev) => {
      const newIncluded = { ...prev };
      newIncluded[id] = !prev[id];
      return newIncluded;
    });
  }

  function updateShowPresentation(bool) {
    setShowPresentation(bool);
  }

  function updateTextBoxInputs(id, text) {
    setTextBoxInputs((prev) => {
      const newInputs = { ...prev };
      newInputs[id] = text;
      return newInputs;
    });
  }

  function updateTextbookExercisePages(newPage) {
    setTextbookExercisePages(newPage);
  }
  return (
    <PresentationContext.Provider
      value={{
        textTranscript,
        setTextTranscript,
        questions,
        vocabulary,
        setQuestions,
        answers,
        setAnswers,
        updateTextTranscript,
        updateQuestions,
        updateAnswers,
        updateVocabulary,
        loadVocabulary,
        gistReadingQuestions,
        gistReadingAnswers,
        updateGistReadingQuestions,
        updateGistReadingAnswers,
        gistReadingPage,
        updateGistReadingPage,
        textbookExercises,
        updateTextbookExercises,
        // discussionObjects,
        // updateDiscussionObjects,
        discussionForms,
        addDiscussionLine,
        updateDiscussionText,
        addSliderStateMemory,
        updateSliderStateMemory,
        sliders,
        included,
        updateIncludedSection,
        updateShowPresentation,
        showPresentation,
        textBoxInputs,
        updateTextBoxInputs,
        textbookExercisePages,
        updateTextbookExercisePages,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export { PresentationContext, PresentationContextProvider };
