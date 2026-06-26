import React, { useState, useEffect, use } from "react";
import { Grid } from "@mui/material";
import PreviewVocabSlides from "@app/components/PresentationPrep/PreviewVocabSlides";

import { useReadingStore } from "@app/stores/useReadingStore";

const PreReadingVocabSlides = () => {
  //const words = ['Carpet', 'Dolphin', 'Rubbish', 'Sequence']
  const [selectedVocabNum, setSelectedVocabNum] = useState(0);
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(0);

  const textbook = useReadingStore((state) => state.textbook);
  const readingVocab = useReadingStore((state) => state.readingVocab);
  const setReadingVocab = useReadingStore((state) => state.setReadingVocab);
  const selectVocabWord = useReadingStore((state) => state.selectVocabWord);
  const deselectVocabWord = useReadingStore((state) => state.deselectVocabWord);

  const checkMarkClicked = async (e) => {
    const index = Number(e.target.value);
    const checked = e.target.checked;

    if (checked) {
      const word = readingVocab[index];
      if (word.img_url) {
        // already has an image — just select, no fetch
        selectVocabWord(index);
      } else {
        // first selection — fetch the image, then select with it
        const img_url = await getPhotos(word.word);
        const encodedURL = encodeURIComponent(img_url);
        selectVocabWord(index, encodedURL);
      }
    } else {
      deselectVocabWord(index); // keeps img_url (sticky)
    }
  };

  async function getVocabulary() {
    try {
      console.log("TEXTBOOK TEXT GET VOCABULARY");
      console.log(textbook);

      const response = await fetch(
        `/api/get-vocabulary-chatgpt?query=${textbook}&cefr_level=a2`,
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
      const enriched = parsedData.map((word) => ({
        ...word,
        img_url: "",
        selected: false,
      }));
      setReadingVocab(enriched);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
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
      console.log(typeof data.results[0]?.urls.full);
      const urlString = data.results[0]?.urls.full || "";
      //return data.results[0]?.urls.full || ""; // Assuming the first result is desired
      return urlString;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return "";
    }
  };
  //rerender when checkmark is clicked
  useEffect(() => {
    //console.log("Vocabulary updated:", vocabulary);

    if (readingVocab) {
      const filtered = readingVocab.filter((item) => item.selected);
      setSelectedVocabulary(filtered);
      setSelectedVocabNum(filtered.length);
      // Automatically set the slide to the first selected word when a new word is selected
      if (filtered.length > 0) {
        setSelectedSlide(0); // Start with the first selected word
      }
    }

    console.log("use effect triggered");
    console.log(selectedVocabulary);
  }, [readingVocab]);

  return (
    <div className="presentation-grid-container">
      <h1
        style={{
          color: "lightgrey",
          fontSize: 24,
          marginLeft: 0,

          //top: 0,
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
        style={{ width: "100%", height: "90%", borderColor: "transparent" }}
      >
        <Grid
          item
          sm={6}
          style={{
            backgroundColor: "white",
            borderColor: "transparent",
            borderWidth: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // overflow: "auto",
            //maxHeight: "100%",
            borderRadius: 10,
            height: "100%",
          }}
        >
          {/* Container of vocabulary list */}
          <Grid
            container
            direction={"row"}
            spacing={0}
            padding={0}
            style={{
              backgroundColor: "white",
              paddingLeft: 0,
              overflow: "auto",
              maxHeight: "100%",
            }}
          >
            {readingVocab
              ? readingVocab.map((word, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    style={{ borderColor: "gray", borderWidth: 1, height: 80 }}
                    marginBottom={2}
                  >
                    <Grid
                      container
                      direction={"row"}
                      key={index}
                      sm={12}
                      style={{
                        marginBottom: 20,
                        borderColor: "gray",
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
                          checked={word.selected ? word.selected : false}
                          type="checkbox"
                          style={{ marginLeft: 20, width: 30, height: 30 }}
                          onChange={(e) => checkMarkClicked(e)}
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
                          color: "gray",
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
            borderColor: "transparent",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <div style={{ width: "80%", height: "100%" }}> */}
          <PreviewVocabSlides
            vocabulary={readingVocab}
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
