"use client";
import { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import { ThinkPairShareContext } from "@app/contexts/ThinkPairShareContext";
import { useLessonStore } from "@app/stores/UseLessonStore";
import DebugZustandButton from "@app/stores/DebugZustandButton";

export default function Think() {
  //const { thinkPhase, updateThinkPhase } = useContext(ThinkPairShareContext);
  // const { updateThinkPhase, thinkPhase, currentUserID, currentLessonID } =
  //   useLessonStore();
  const updateThinkPhase = useLessonStore((state) => state.updateThinkPhase);
  const thinkPhase = useLessonStore((state) => state.thinkPhase);
  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);
  const [formData, setFormData] = useState({
    theme: "",
    number: "",
    grammar_tense: "",
  });

  const [sentenceStems, setSentenceStems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSentenceStemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStems = [...thinkPhase];
    updatedStems[index] = {
      ...updatedStems[index],
      [name]: value,
    };

    //setSentenceStems(updatedStems);
    updateThinkPhase(updatedStems); // Assuming your context accepts an array
  };

  async function getSentenceStems() {
    try {
      console.log("getSentenceStems called");
      console.log(formData);

      const sentenceStemParams = JSON.stringify(formData);

      const response = await fetch(
        `/api/get-sentence-stems-chatgpt?sentenceStemParams=${sentenceStemParams}&cefr_level=a2`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.text(); // Assuming the server returns JSON

      console.log("Raw response data:", data); // Log raw data

      const jsonString = data.replace(/```json\n|```/g, "").trim();

      // Preprocess the string to remove newline characters and spaces
      const cleanedData = jsonString.replace(/(\r\n|\n|\r)/gm, "").trim();

      // Parse the cleaned string as JSON
      let parsedData;
      console.log(jsonString);

      try {
        parsedData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Failed to parse JSON response");
      }

      console.log("Parsed data:", parsedData); // Log the parsed data
      console.log(typeof parsedData); // Log the type of parsed data

      //loadVocabulary(parsedData);
      //setSentenceStems(parsedData);
      //updateThinkPhase(parsedData);
      updateThinkPhase(parsedData);
      console.log(
        "👁 thinkPhase in component after update:",
        useLessonStore.getState().thinkPhase
      );

      console.log("Updated thinkPhase:", thinkPhase);
      //console.log("Updated sentence stems:", sentenceStems);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    getSentenceStems();
  };

  return (
    <>
      <h1>Think - Pair - Share</h1>
      <h1>{"Zustand Store: " + currentUserID}</h1>
      <h1>{"ZustandLesson ID: " + currentLessonID}</h1>
      <button onClick={() => updateThinkPhase([{ sentence_stem: "test" }])}>
        🔁 Trigger thinkPhase Update
      </button>
      <DebugZustandButton />

      <Grid container spacing={2} direction="row">
        <Grid item xs={3}>
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-4 shadow-lg rounded-xl space-y-4"
          >
            <div>
              <label className="block mb-1 font-semibold">theme</label>
              <input
                type="text"
                name="theme"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Number of sentence stems"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">number</label>
              <input
                type="text"
                name="number"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Type of grammar to use"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Grammar Tense</label>
              <textarea
                name="grammar_tense"
                value={formData.grammar_tense}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Your message"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </Grid>
        <Grid item xs={3}>
          <div>
            <form className="max-w-md mx-auto p-4 shadow-lg rounded-xl space-y-4">
              {thinkPhase
                ? //? sentenceStems.map((sentenceStem, index) => (
                  thinkPhase.map((sentenceStem, index) => (
                    <textarea
                      key={sentenceStem.id || index}
                      type="text"
                      name="sentence_stem"
                      value={sentenceStem.sentence_stem}
                      onChange={(e) => handleSentenceStemChange(index, e)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your your sentence stem"
                      rows="2"
                    />
                  ))
                : null}
            </form>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div>
            <form className="max-w-md mx-auto p-4 shadow-lg rounded-xl space-y-4">
              {thinkPhase
                ? thinkPhase.map((sentenceStem, index) => (
                    <textarea
                      key={sentenceStem.id || index}
                      type="text"
                      name="prompting_question"
                      value={sentenceStem.prompting_question}
                      onChange={(e) => handleSentenceStemChange(index, e)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your your sentence stem"
                      rows="2"
                    />
                  ))
                : null}
            </form>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div>
            <form className="max-w-md mx-auto p-4 shadow-lg rounded-xl space-y-4">
              {thinkPhase
                ? thinkPhase.map((sentenceStem, index) => (
                    <textarea
                      key={sentenceStem.id || index}
                      type="text"
                      name="sharing_statement"
                      value={sentenceStem.sharing_statement}
                      onChange={(e) => handleSentenceStemChange(index, e)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your your sentence stem"
                      rows="2"
                    />
                  ))
                : null}
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
