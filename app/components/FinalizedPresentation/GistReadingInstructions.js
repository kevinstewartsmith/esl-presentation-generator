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
          {/* <h3> */}
          <li>
            {"Open " + textBoxInputs["book"] + " to p." + gistReadingPage}
          </li>
          {/* </h3> */}
          <li>
            {"Read " + textBoxInputs["title"]}
            <strong>
              <em> quickly</em>
            </strong>
          </li>

          <li>
            <em>Answer the question :</em> {gistReadingQuestions}
          </li>
          <li>No talking</li>
          <li>{sliders[time].value + " minutes"}</li>
        </ul>
      </section>
    </>
  );
};

export default GistReadingInstructions;
