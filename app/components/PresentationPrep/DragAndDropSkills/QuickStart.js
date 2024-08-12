import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { BorderColor } from "@mui/icons-material";
import { Grid } from "@mui/material";

function Quickstart() {
  const containers = ["A", "B"];
  const [parent, setParent] = useState(null);

  const [isDropped, setIsDropped] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable">Reading For Gist and Detail</Draggable>
  );
  const draggableMarkup2 = (
    <Draggable id="draggable2">Listening for Gist and Detail</Draggable>
  );

  function handleDragEnd(event) {
    console.log(event);
    const { over } = event;
    console.log(over);

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}

        <Grid container direction="row" spacing={2} style={{ width: "100%" }}>
          {containers.map((id) => (
            // We updated the Droppable component so it would accept an `id`
            // prop and pass it to `useDroppable`
            <Grid item xs={6}>
              <Droppable key={id} id={id}>
                {parent === id ? draggableMarkup : "Drop here"}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DndContext>
    </div>
  );
}

export default Quickstart;
