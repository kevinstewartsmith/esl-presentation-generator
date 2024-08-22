import React, { useState, useContext, useEffect, use } from "react";
import { Grid } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { PresentationContext } from "@app/contexts/PresentationContext";
import PreviewVocabSlides from "@app/components/PresentationPrep/PreviewVocabSlides";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const PreReadingVocabSlides = () => {
  //const words = ['Carpet', 'Dolphin', 'Rubbish', 'Sequence']
  const [selectedVocabNum, setSelectedVocabNum] = useState(0);
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const {
    textTranscript,
    // vocabulary,
    // updateVocabulary,
    // loadVocabulary
    //lessonID,
  } = useContext(PresentationContext);
  const {
    textbook,
    vocabulary,
    updateVocabulary,
    loadVocabulary,
    fetchVocabulary,
    userID,
    lessonID,
  } = useContext(ReadingForGistAndDetailContext);
  //fetchVocabulary();

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0) {
      console.log("PREREADING VOCAB: FETCHING VOCABULARY");
      fetchVocabulary(userID, lessonID, "Reading For Gist and Detail");
      setCount(count + 1);
    }
  }, []);

  const checkMarkClicked = async (e) => {
    const key = e.target.value;
    const checked = e.target.checked;

    console.log(
      checked
        ? `Checkmark clicked: key ${key}`
        : `Checkmark unclicked: key ${key}`
    );

    if (checked) {
      const word = vocabulary[key];
      const img_url = await getPhotos(word.word);
      console.log(img_url);
      const updatedVocabulary = [...vocabulary];
      updatedVocabulary[key] = { ...word, img_url, selected: true };
      updateVocabulary(updatedVocabulary);
      console.log(vocabulary);
    } else {
      const updatedVocabulary = [...vocabulary];
      updatedVocabulary[key] = {
        ...vocabulary[key],
        selected: false,
        img_url: "",
      };
      updateVocabulary(updatedVocabulary);
      console.log(vocabulary);
    }
  };

  async function getVocabulary() {
    try {
      console.log("TEXTBOOK TEXT GET VOCABULARY");
      console.log(textbook);

      const response = await fetch(
        `/api/get-vocabulary-chatgpt?query=${textbook}&cefr_level=a2`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.text(); // Assuming the server returns JSON

      console.log("Raw response data:", data); // Log raw data

      // Preprocess the string to remove newline characters and spaces
      const cleanedData = data.replace(/(\r\n|\n|\r)/gm, "").trim();

      // Parse the cleaned string as JSON
      let parsedData;

      try {
        parsedData = JSON.parse(cleanedData);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Failed to parse JSON response");
      }

      console.log("Parsed data:", parsedData); // Log the parsed data
      console.log(typeof parsedData); // Log the type of parsed data

      loadVocabulary(parsedData);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  }

  async function getPhotos0() {
    const response = await fetch(`/api/images/search?query=${photoInputValue}`);
    //const response = await fetch(`/api/test`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    console.log(typeof data.results);
    console.log(data.results);
    setPhotoSearchResults(data.results);
  }

  const getPhotos = async (query) => {
    console.log("Getting photos for query:", query);
    try {
      const response = await fetch(`/api/get-image-unsplash?query=${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.results[0]?.urls.full || "sheeit");
      return data.results[0]?.urls.full || ""; // Assuming the first result is desired
    } catch (error) {
      console.error("Error fetching photos:", error);
      return "";
    }
  };
  //rerender when checkmark is clicked
  useEffect(() => {
    //console.log("Vocabulary updated:", vocabulary);

    if (vocabulary) {
      const filtered = vocabulary.filter((item) => item.selected);
      setSelectedVocabulary(filtered);
      setSelectedVocabNum(filtered.length);
      // Automatically set the slide to the first selected word when a new word is selected
      if (filtered.length > 0) {
        setSelectedSlide(0); // Start with the first selected word
      }
    }

    console.log("use effect triggered");
    console.log(selectedVocabulary);
  }, [vocabulary]);

  return (
    <div className="presentation-grid-container">
      <h1
        style={{
          color: "lightgrey",
          fontSize: 24,
          marginLeft: 60,
          borderColor: "white",
          top: 0,
        }}
      >
        Select words to teach before reading
      </h1>
      <Grid
        container
        //className="presentation-grid-container"
        direction={"row"}
        margin={0}
        spacing={0}
        padding={0}
        sm={12}
        style={{ width: "100%", height: "90%", borderColor: "red" }}
      >
        <Grid
          item
          sm={6}
          style={{
            backgroundColor: "white",
            borderColor: "purple",
            borderWidth: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            maxHeight: "100%",
            borderRadius: 10,
          }}
        >
          <Grid
            container
            direction={"column"}
            spacing={0}
            padding={0}
            style={{ backgroundColor: "white", paddingLeft: 0 }}
          >
            {vocabulary
              ? vocabulary.map((word, index) => (
                  <Grid
                    item
                    xs={12}
                    style={{ borderColor: "red", borderWidth: 1, height: 80 }}
                  >
                    <Grid
                      container
                      direction={"row"}
                      key={index}
                      sm={12}
                      style={{
                        marginBottom: 20,
                        borderColor: "green",
                        borderWidth: 1,
                        height: 80,
                      }}
                    >
                      <Grid
                        item
                        xs={0.5}
                        sm={1}
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          value={index}
                          checked={word.selected}
                          type="checkbox"
                          style={{ marginLeft: 20, width: 30, height: 30 }}
                          onClick={checkMarkClicked}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={11.5}
                        sm={4}
                        className="flex items-center "
                        style={{
                          height: "100%",
                          width: "100%",
                          fontSize: 24,
                          marginLeft: 10,
                          color: "pink",
                        }}
                      >
                        <h1 style={{ color: "gray" }}>
                          {word.word + " " + index}
                        </h1>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
              : null}
          </Grid>
          {/* </div> */}
        </Grid>
        <Grid
          item
          sm={6}
          style={{
            width: "100%",
            height: "100%",
            borderWidth: 1,
            borderColor: "green",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <div style={{ width: "80%", height: "100%" }}> */}
          <PreviewVocabSlides
            vocabulary={vocabulary}
            selectedVocabNum={selectedVocabNum}
            selectedVocabulary={selectedVocabulary}
            selectedSlide={selectedSlide}
            getVocabularyPressed={getVocabulary}
            setSelectedSlide={setSelectedSlide}
          />
          {/* </div> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default PreReadingVocabSlides;
