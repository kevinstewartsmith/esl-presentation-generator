import React from "react";

const GistReadingInstructions = ({
  gistReadingPage,
  gistReadingQuestions,
  sliders,
  discussionForms,
  included,
  textBoxInputs,
  time,
  inputTexts,
}) => {
  const minutes = inputTexts["gistReadingTime"] === 1 ? "minute" : "minutes";

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
            {/* {"Open " + textBoxInputs["book"] + " to p." + gistReadingPage} */}
            {"Open "}
            <stong>{inputTexts["book"]}</stong> {" to p." + inputTexts["page"]}
          </li>
          {/* </h3> */}
          <li>
            {"Read "} <em>{"'" + inputTexts["title"] + "' "}</em>
            <strong>
              <em>
                <u>quickly</u>
              </em>
            </strong>
          </li>

          <li>
            <em>Answer the question :</em> {inputTexts["question"]}
          </li>
          <li>No talking</li>
          <li>{inputTexts["gistReadingTime"] + " " + minutes}</li>
        </ul>
      </section>
    </>
  );
};

export default GistReadingInstructions;
