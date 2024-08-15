import React, { useContext } from "react";
import { ReadingForGistAndDetailContext } from "@app/contexts/ReadingForGistAndDetailContext";

const DetailReadingInstructions = ({ textbookExercises, slider }) => {
  const { inputTexts } = useContext(ReadingForGistAndDetailContext);
  const minutes = slider === 1 ? "minute" : "minutes";
  return (
    <>
      <section
      //data-background-color="red"
      >
        <h1>
          Reading for <em>Detail</em>
        </h1>
        <ul>
          <li>
            {"Read "} <em>{"'" + inputTexts["title"] + "' "}</em>
            <strong>
              <em>
                <u>slowly</u>
              </em>
            </strong>
          </li>
          <li>
            <em>
              {"Complete p." + inputTexts["exercisePage"] + " Exercise(s): "}
            </em>

            {inputTexts["exercise"]}
          </li>
          <li>No talking</li>
          <li>Raise your hand when you are finished</li>
          <li>
            <em>{slider + " " + minutes}</em>
          </li>
        </ul>
      </section>
    </>
  );
};

export default DetailReadingInstructions;
