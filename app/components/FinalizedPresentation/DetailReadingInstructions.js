import React from "react";

const DetailReadingInstructions = ({ textbookExercises, sliders }) => {
  return (
    <>
      <section data-background-color="red">
        <h1>
          Reading for <em>Detail</em>
        </h1>
        <ul>
          <li>
            Read Student Book p.23{" "}
            <strong>
              <em>slowly</em>
            </strong>
          </li>
          <li>
            <em>Complete Exercises: </em>
            {/* {presData.detailReading.book +
                " " +
                presData.detailReading.page +
                " exercise " +
                presData.detailReading.exercises}{" "} */}
            {textbookExercises}
          </li>
          <li>No talking</li>
          <li>Raise your hand when you are finished</li>
          <li>
            <em>{sliders["detailReadingTimeLimit"].value + " minutes"}</em>
          </li>
        </ul>
      </section>
    </>
  );
};

export default DetailReadingInstructions;
