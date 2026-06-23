"use client";
import { createContext, useState, useEffect, useMemo, use } from "react";
import { debounce } from "@app/utils/debounce";

async function safeJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

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
  const [lessonIDReadingGD, setLessonIDReadingGD] = useState("");

  function updateLessonIDReadingGD(id) {
    setLessonIDReadingGD(id);
  }

  const [textbook, setTextbook] = useState();
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();

  function updateTextbook(newData) {
    setTextbook(newData);
  }

  function updateTextbookTranscript(newData) {
    setTextbook((prevTextbook) => ({
      ...prevTextbook,
      textEdit: [...(prevTextbook?.textEdit || []), newData],
    }));
  }

  function updateQuestions(newData) {
    setQuestions(newData);
  }

  function updateAnswers(newData) {
    setAnswers(newData);
  }

  async function fetchTextbookDataFromDB(userID, lessonID, stageID) {
    const enc = encodeURIComponent("Reading For Gist and Detail");
    if (!userID || !lessonID) return;
    const url = `/api/firestore/get-textbook-data?userID=${userID}&lessonID=${lessonID}&stageID=${enc}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await safeJson(response);
      if (data?.texts) setTextbook(data.texts);
      if (data?.questions) setQuestions(data.questions);
      if (data?.answers) setAnswers(data.answers);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const body = JSON.stringify(textbook);
    const url = `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${enc}&data=${body}&textType=BookText`;
    async function post() {
      try {
        const response = await fetch(url, { method: "POST" });
        const data = await safeJson(response);
        console.log("RESPONSE FROM POSTING TEXTBOOK DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    post();
  }, [textbook]);

  useEffect(() => {
    if (!lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const body = JSON.stringify(questions);
    const url = `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${enc}&data=${body}&textType=QuestionText`;
    async function post() {
      try {
        const response = await fetch(url, { method: "POST" });
        await safeJson(response);
      } catch (error) {
        console.log(error);
      }
    }
    post();
  }, [questions]);

  useEffect(() => {
    if (!lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const body = JSON.stringify(answers);
    const url = `/api/firestore/post-texts?userID=${userID}&lessonID=${lessonID}&stageID=${enc}&data=${body}&textType=AnswerText`;
    async function post() {
      try {
        const response = await fetch(url, { method: "POST" });
        await safeJson(response);
      } catch (error) {
        console.log(error);
      }
    }
    post();
  }, [answers]);

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
    if (!userID || !lessonID) return;
    const url = `/api/firestore/get-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await safeJson(response);
      if (data) setDiscussionForms(data);
    } catch (error) {
      console.error(error);
    }
  }

  function updateDiscussionText(id, index, text) {
    setDiscussionForms((prev) => {
      const form = prev[id] || { discussionTexts: [] };
      const newTexts = [...form.discussionTexts];
      newTexts[index] = text;
      return { ...prev, [id]: { ...form, discussionTexts: newTexts } };
    });
  }

  async function updateDiscussionTextsDataInFirestore(newData, lessonID) {
    const data = JSON.stringify(newData);
    const url = `/api/firestore/post-discussions?userID=${userID}&lessonID=${lessonID}&stageID=teststage&data=${data}`;
    try {
      const response = await fetch(url, { method: "POST" });
      return response;
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }

  const [vocabulary, setVocabulary] = useState([]);

  function updateVocabulary(newVocabulary) {
    setVocabulary(newVocabulary);
  }

  function loadVocabulary(data) {
    const words = data.map((word) => ({
      ...word,
      selected: false,
      img_url: "",
    }));
    console.log(words);
    setVocabulary(words);
  }

  async function fetchVocabulary(userID, lessonID, stageID) {
    if (!userID || !lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const url = `/api/firestore/get-vocabulary?userID=${userID}&lessonID=${lessonID}&stageID=${enc}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await safeJson(response);
      console.log("Raw response data VOCAB:", data);
      if (data) setVocabulary(data);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  }

  useEffect(() => {
    if (!lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const body = JSON.stringify(vocabulary);
    const url = `/api/firestore/post-vocabulary?userID=${userID}&lessonID=${lessonID}&stageID=${enc}&data=${body}`;
    async function post() {
      try {
        const response = await fetch(url, { method: "POST" });
        await safeJson(response);
      } catch (error) {
        console.log(error);
      }
    }
    post();
  }, [vocabulary]);

  const [included, setIncluded] = useState({});

  function updateIncludedSection(id) {
    setIncluded((prev) => {
      const newIncluded = { ...prev };
      newIncluded[id] = !prev[id];
      return newIncluded;
    });
  }

  async function fetchIncludedDataFromFirestore(userID, lessonID, stageID) {
    const enc = encodeURIComponent("Reading For Gist and Detail");
    if (!userID || !lessonID) return;
    const url = `/api/firestore/get-included?userID=${userID}&lessonID=${lessonID}&stageID=${enc}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await safeJson(response);
      console.log("Included DATA from Firestore:", data);
      if (data) setIncluded(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!lessonID) return;
    const enc = encodeURIComponent("Reading For Gist and Detail");
    const body = JSON.stringify(included);
    const url = `/api/firestore/post-included?userID=${userID}&lessonID=${lessonID}&stageID=${enc}&data=${body}`;
    async function post() {
      try {
        const response = await fetch(url, { method: "POST" });
        const data = await safeJson(response);
        console.log("RESPONSE FROM POSTING INCLUDED DATA:", data);
      } catch (error) {
        console.log(error);
      }
    }
    post();
  }, [included]);

  let counter = 0;

  function updateLessonID(id) {
    setLessonID(id);
  }

  function updateInputTextsReading(key, value) {
    setInputTexts({ ...inputTexts, [key]: value });
    setNewInput({ [key]: value });
    counter++;
  }

  const [discussionsLoaded, setDiscussionsLoaded] = useState(false);

  async function getAllInputDataFromFirestore(userID, lessonID, stageID) {
    if (!userID || !lessonID) return;
    const url = `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getAllInputs&stageID=${stageID}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await safeJson(response);
      console.log("Input Data from Firestore:", data);
      if (data) setInputTexts(data);
      setDiscussionsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateInputDataInFirestore(newData, lessonID) {
    const data = JSON.stringify(newData);
    const url = `/api/firestore/post-lessons?userID=${userID}&lessonID=${lessonID}&method=postLessonInput&stageID=teststage&key=name&value=omg&data=${data}`;
    try {
      const response = await fetch(url, { method: "POST" });
      console.log("Response from Firestore:", response);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }

  async function fetchDataFromFirestore(userID, lessonID, stageID) {
    if (!userID || !lessonID) return;
    const url = `/api/firestore/get-lessons?userID=${userID}&lessonID=${lessonID}&method=getOneLesson&stageID=${stageID}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await safeJson(response);
      if (data) setInputTexts(data);
    } catch (error) {
      console.error(error);
    }
  }

  const debouncedSave = useMemo(
    () =>
      debounce((newData, lessonID) => {
        console.log("Calling Firestore READING CONTEXT:", newData);
        updateInputDataInFirestore(newData, lessonID);
      }, 5000),
    [],
  );

  const debouncedSaveDiscussionTexts = useMemo(
    () =>
      debounce((newData, lessonID) => {
        updateDiscussionTextsDataInFirestore(newData, lessonID);
      }, 5000),
    [],
  );

  // useEffect(() => {
  //   if (Object.keys(inputTexts).length > 0) {
  //     debouncedSave(inputTexts, lessonID);
  //   } else {
  //     console.log("No data to post");
  //   }
  // }, [inputTexts]);

  useEffect(() => {
    if (Object.keys(discussionForms).length > 0 && discussionsLoaded) {
      debouncedSaveDiscussionTexts(discussionForms, lessonID);
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
        textbook,
        questions,
        answers,
        updateTextbook,
        updateQuestions,
        updateAnswers,
        fetchTextbookDataFromDB,
        updateTextbookTranscript,
        vocabulary,
        loadVocabulary,
        updateVocabulary,
        fetchVocabulary,
        lessonIDReadingGD,
        updateLessonIDReadingGD,
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
