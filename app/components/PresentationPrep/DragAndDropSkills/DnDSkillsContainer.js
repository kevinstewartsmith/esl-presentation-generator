import React, { useState } from "react";
import { closestCorners, DndContext } from "@dnd-kit/core";
import Column from "./Column";
import { arrayMove } from "@dnd-kit/sortable";

const DnDSkillsContainer = () => {
  const [stages, setStages] = useState([
    { id: "1", title: "Warm-up" },
    { id: "2", title: "Presentation" },
    { id: "3", title: "Practice" },
    { id: "4", title: "Production" },
  ]);

  const [choices, setChoices] = useState([
    { id: "1", title: "Choice 1" },
    { id: "2", title: "Choice 2" },
    { id: "3", title: "Choice 3" },
    { id: "4", title: "Choise 4" },
  ]);

  // const getTaskPos = (id) => {
  //   return stages.findIndex((stage) => stage.id === id);
  // };
  const getTaskPos = (id) => stages.findIndex((stage) => stage.id === id);

  // const handleDragEnd = (event) => {
  //   console.log("Handle Drag End");
  //   const { active, over } = event;
  //   if (active.id === over.id) {
  //     return;
  //   }
  //   setStages((stages) => {
  //     const originalPos = getTaskPos(active.id);
  //     console.log("Original Pos: ", originalPos);
  //     const newPos = getTaskPos(over.id);
  //     console.log("New Pos: ", newPos);
  //     return arrayMove(stages, originalPos, newPos);
  //   });
  // };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return; // Ensure 'over' exists

    const sourceColumn = getColumn(active.id);
    const destinationColumn = getColumn(over.id);

    if (
      !sourceColumn ||
      !destinationColumn ||
      sourceColumn === destinationColumn
    )
      return; // No change if same column

    // Perform updates independently for each column
    const moveItem = (source, setSource, destination, setDestination) => {
      const sourceIndex = source.findIndex((item) => item.id === active.id);
      const destinationIndex = destination.findIndex(
        (item) => item.id === over.id
      );

      if (sourceIndex === -1 || destinationIndex === -1) return;

      // Remove item from source column
      const [movedItem] = source.splice(sourceIndex, 1);

      // Add item to destination column
      destination.splice(destinationIndex, 0, movedItem);

      setSource([...source]);
      setDestination([...destination]);
    };

    if (sourceColumn === "stages") {
      moveItem(stages, setStages, choices, setChoices);
    } else {
      moveItem(choices, setChoices, stages, setStages);
    }
  };

  const getColumn = (id) => {
    if (stages.find((item) => item.id === id)) return "stages";
    if (choices.find((item) => item.id === id)) return "choices";
    return null;
  };

  return (
    <div>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Column stages={stages} setStages={setStages} />
        <Column stages={choices} setStages={setChoices} />
      </DndContext>
    </div>
  );
};

export default DnDSkillsContainer;
