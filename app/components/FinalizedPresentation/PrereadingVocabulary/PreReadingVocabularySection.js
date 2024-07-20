import React from "react";

const PreReadingVocabularySection = ({ vocabulary }) => {
  console.log("vocabularyPRES: " + JSON.stringify(vocabulary));
  return (
    <>
      {vocabulary.map((word, index) => (
        <section data-background-color="red" key={index}>
          <h3>{word.word}</h3>
          <p></p>
          <img src={word.img_url} alt={word.word} />
        </section>
      ))}
    </>
  );
};

export default PreReadingVocabularySection;
