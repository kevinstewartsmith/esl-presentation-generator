"use client";
import { createContext, useState, useEffect, useMemo, use } from "react";
import { debounce } from "@app/utils/debounce";

const ReadingForGistAndDetailContext = createContext();

const ReadingForGistAndDetailContextProvider = ({ children }) => {
  const stageID = "Reading For Gist and Detail";
  const [userID, setUserID] = useState("kevinstewartsmith");
  const [title, setTitle] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [text, setText] = useState("");
  const [inputTexts, setInputTexts] = useState({});
  const [lessonID, setLessonID] = useState("");
  const [newInput, setNewInput] = useState({});

  /////////////////////////////////////////////////////////////////
  //START: Lesson Information/////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  const [lessonIDReadingGD, setLessonIDReadingGD] = useState("");

  function updateLessonIDReadingGD(id) {
    console.log("Update Lesson ID in RFGD Context: " + id);
    setLessonIDReadingGD(id);
  }

  /////////////////////////////////////////////////////////////////
  //END: Lesson Information//////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  //START: Textbook, Questions, and Answers state////////////////
  ///////////////////////////////////////////////////////////////
  const [textbook, setTextbook] = useState();
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();

  function updateTextbook(newData) {
    setTextbook(newData);
  }

  function updateQuestions(newData) {
    setQuestions(newData);
  }

  function updateAnswers(newData) {
    setAnswers(newData);
  }

  async function fetchTextbookDataFromDB(userID, lessonID, stageID) {
    const stage = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stage);
    console.log("Getting Textbook Data from Firestore");
    try {
      const response = await fetch(
        `/api/firestore/get-textbook-data?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Textbook DATA from Firestore:", data);
      data.texts.transcript ? setTextbook(data.texts.transcript) : null;
      data.questions.transcript
        ? setQuestions(data.questions.transcript)
        : null;
      data.answers.transcript ? setAnswers(data.answers.transcript) : null;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("Post Textbook Data");
    const stageID = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    console.log("Encoded Stage ID:", encodedStageID);
    async function postTextbookData() {
      try {
        const response = await fetch(
          `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${textbook}&textType=BookText`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING TEXTBOOK DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postTextbookData();
  }, [textbook]);

  useEffect(() => {
    console.log("Post Questions Data");
    const stageID = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    console.log("Encoded Stage ID:", encodedStageID);
    async function postTextbookData() {
      try {
        const response = await fetch(
          `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${questions}&textType=QuestionText`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING QUESTION TEXT DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postTextbookData();
  }, [questions]);

  useEffect(() => {
    console.log("Post Answers Data");
    const stageID = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    console.log("Encoded Stage ID:", encodedStageID);
    async function postTextbookData() {
      try {
        const response = await fetch(
          `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${answers}&textType=AnswerText`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING ANSWER TEXT DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postTextbookData();
  }, [answers]);

  ///////////////////////////////////////////////////////////////
  //END: Textbook, Questions, and Answers state/////////////////
  ///////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  //Discussion forms state///////////////////////////////////
  ///////////////////////////////////////////////////////////
  const [discussionForms, setDiscussionForms] = useState({});

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

  async function getAllDiscussionDataFromFirestore(userID, lessonID, stageID) {
    console.log("Getting all discussion data from Firestore");
    try {
      const response = await fetch(
        `/api/firestore/get-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Discussion DATA from Firestore:", data);
      //const parsedData = JSON.parse(data);
      console.log("Parsed Discussion Data Type:", typeof data);
      setDiscussionForms(data);
    } catch (error) {
      console.error(error);
    }
  }

  function updateDiscussionText(id, index, text) {
    console.log("updateDiscussionText NEW CONTEXT");
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

  async function updateDiscussionTextsDataInFirestore(newData, lessonID) {
    console.log("updateDiscussionTextsDataInFirestore NEW CONTEXT");
    console.log("Updating Firestore with new data:", newData);
    console.log("Lesson ID in Input post method:", lessonID);

    const data = JSON.stringify(newData);
    try {
      const response = await fetch(
        `/api/firestore/post-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage&data=${data}`,
        {
          method: "POST",
        }
      );
      console.log("Response from Firestore:", response);
      return response;
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
  ////////////////////////////////////////////////////////////
  //End of Discussion forms state////////////////////////////
  ///////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  //START of Vocabulary state////////////////////////////////
  ///////////////////////////////////////////////////////////
  const [vocabulary, setVocabulary] = useState([]);

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

  async function fetchVocabulary(userID, lessonID, stageID) {
    try {
      console.log("GET VOCABULARY");
      const stage = "Reading For Gist and Detail";
      const encodedStageID = encodeURIComponent(stage);

      const response = await fetch(
        //`/api/get-vocabulary-chatgpt?query=${textbook}&cefr_level=a2`
        `/api/firestore/get-vocabulary?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json(); // Assuming the server returns JSON

      console.log("Raw response data:", data); // Log raw data
      setVocabulary(data);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  }

  useEffect(() => {
    console.log("Post Vocabulary Data");
    console.log(vocabulary);

    const stageID = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    console.log("Encoded Stage ID:", encodedStageID);

    const stringifyVocabulary = JSON.stringify(vocabulary);
    async function postVocabularyData() {
      try {
        const response = await fetch(
          `/api/firestore/post-vocabulary?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${stringifyVocabulary}`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING VOCABULARY DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postVocabularyData();
  }, [vocabulary]);

  //////////////////////////////////////////////////////////
  //END of Vocabulary state////////////////////////////////
  /////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  //START: Checkbox and Label State -INCLUDED////////////////
  //////////////////////////////////////////////////////////
  const [included, setIncluded] = useState({});

  function updateIncludedSection(id) {
    console.log("updateIncludedSection READING CONTEXT: " + id);
    //check if the id is already in the included object
    //if it is, switch the boolean value
    //if it is not, add it with a value of true
    setIncluded((prev) => {
      const newIncluded = { ...prev };
      newIncluded[id] = !prev[id];
      return newIncluded;
    });
  }

  async function fetchIncludedDataFromFirestore(userID, lessonID, stageID) {
    //encode stageID
    const stage = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stage);
    console.log("Getting Included Data from Firestore");

    try {
      const response = await fetch(
        `/api/firestore/get-included?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Included DATA from Firestore:", data);
      setIncluded(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("Post Included Data");
    const stageID = "Reading For Gist and Detail";
    const encodedStageID = encodeURIComponent(stageID);
    console.log("Encoded Stage ID:", encodedStageID);
    const includedDataString = JSON.stringify(included);
    async function postIncludedData() {
      try {
        const response = await fetch(
          `/api/firestore/post-included?userID=${userID}&lessonID=${lessonID}&stageID=${encodedStageID}&data=${includedDataString}`,
          { method: "POST" }
        );
        const data = await response.json();
        console.log("RESPONSE FROM POSTING INCLUDED DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    postIncludedData();
  }, [included]);

  //////////////////////////////////////////////////////////
  //END: Checkbox and Label State - INCLUDED/////////////////
  //////////////////////////////////////////////////////////

  let counter = 0;

  function updateLessonID(id) {
    console.log("Update Lesson ID in RFGD Context: " + id);
    setLessonID(id);
  }

  function updateInputTextsReading(key, value) {
    console.log("Updating input texts in RFGD Context:", key, value);
    console.log("LEsson ID in update text input :", lessonID);
    setInputTexts({ ...inputTexts, [key]: value });
    setNewInput({ [key]: value });
    counter++;
    //setTextTitle(value);
  }
  const [discussionsLoaded, setDiscussionsLoaded] = useState(false);
  async function getAllInputDataFromFirestore(userID, lessonID, stageID) {
    try {
      const response = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getAllInputs&stageID=${stageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Input Data from Firestore:", data);
      setInputTexts(data);
      setDiscussionsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateInputDataInFirestore(newData, lessonID) {
    console.log("Updating Firestore with new data:", newData);
    console.log("Lesson ID in Input post method:", lessonID);
    console.log("User ID in Input post method:", userID);

    const id = "KKlHzoJ0AV4sWd4VISzA";
    const data = JSON.stringify(newData);
    try {
      const response = await fetch(
        `/api/firestore/post-lessons?userID=${userID}&lessonID=${lessonID}&method=postLessonInput&stageID=teststage&key=name&value=omg&data=${data}`,
        {
          method: "POST",
        }
      );
      console.log("Response from Firestore:", response);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
  async function fetchDataFromFirestore(userID, lessonID, stageID) {
    try {
      const response = await fetch(
        `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getOneLesson&stageID=${stageID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON response
      console.log("Data from Firestore:", data);
      setInputTexts(data);
      //setQuestions(data.questions);
    } catch (error) {
      console.error(error);
    }
  }

  const debouncedSave = useMemo(
    () =>
      debounce((newData, lessonID) => {
        console.log("Calling Firestore READING CONTEXT:", newData);
        console.log("Lesson ID in debounced save:", lessonID);
        updateInputDataInFirestore(newData, lessonID);
      }, 5000),
    []
  );

  const debouncedSaveDiscussionTexts = useMemo(
    () =>
      debounce((newData, lessonID) => {
        console.log("Calling Firestore READING CONTEXT:", newData);
        console.log("Lesson ID in debounced save:", lessonID);
        updateDiscussionTextsDataInFirestore(newData, lessonID);
      }, 5000),
    []
  );

  useEffect(() => {
    console.log("POSTING USEEFFECT TRIGGERED");
    console.log(Object.keys(inputTexts).length);
    console.log("Lesson ID in useEffect:", lessonID);
    if (Object.keys(inputTexts).length > 0) {
      console.log("Data changed: " + inputTexts);
      debouncedSave(inputTexts, lessonID);
      console.log("Inside of posting triggered");
    } else {
      console.log("No data to post");
    }
  }, [inputTexts]);

  useEffect(() => {
    console.log("Discussion forms changed:", discussionForms);
    if (Object.keys(discussionForms).length > 0 && discussionsLoaded) {
      console.log("Data changed: " + discussionForms);
      debouncedSaveDiscussionTexts(discussionForms, lessonID);
      console.log("Inside of posting triggered");
    } else {
      console.log("No data to post");
    }
  }, [discussionForms]);

  return (
    <ReadingForGistAndDetailContext.Provider
      value={{
        updateInputTextsReading,
        inputTexts,
        updateLessonID,
        lessonID,
        userID,
        fetchDataFromFirestore,
        getAllInputDataFromFirestore,
        discussionForms,
        addDiscussionLine,
        updateDiscussionText,
        getAllDiscussionDataFromFirestore,

        //Textbook, Questions, and Answers
        textbook,
        questions,
        answers,
        updateTextbook,
        updateQuestions,
        updateAnswers,
        fetchTextbookDataFromDB,

        //Vocabulary
        vocabulary,
        loadVocabulary,
        updateVocabulary,
        fetchVocabulary,

        //Lesson Information
        lessonIDReadingGD,
        updateLessonIDReadingGD,

        //Checkbox and Label
        included,
        updateIncludedSection,
        fetchIncludedDataFromFirestore,
      }}
    >
      {children}
    </ReadingForGistAndDetailContext.Provider>
  );
};

export {
  ReadingForGistAndDetailContext,
  ReadingForGistAndDetailContextProvider,
};
