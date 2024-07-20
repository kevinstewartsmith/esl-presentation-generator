import React from "react";

const GistReadingInstructions = ({
  gistReadingPage,
  gistReadingQuestions,
  sliders,
  discussionForms,
  included,
  textBoxInputs,
  time,
}) => {
  return (
    <>
      <section>
        <h1>
          Reading for{" "}
          <strong>
            <em>Gist</em>
          </strong>
        </h1>
        <ul>
          {/* <li>{vocabulary[0].word}</li> */}
          <li>
            {"Open " + textBoxInputs["book"] + " to p." + gistReadingPage}
          </li>
          <li>
            {"Read " + textBoxInputs["title"]}
            <strong>
              <em> quickly</em>
            </strong>
          </li>
          {/* <li>
            Read
            <strong>
              <em> quickly</em>
            </strong>
          </li> */}
          <li>
            <em>Answer the question :</em> {gistReadingQuestions}
          </li>
          <li>No talking</li>
          <li>{sliders[time].value + " minutes"}</li>
        </ul>
        {/* <section data-markdown>something</section> */}
      </section>
    </>
  );
};

export default GistReadingInstructions;
