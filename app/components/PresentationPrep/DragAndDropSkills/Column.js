import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sort } from "@mui/icons-material";
import Stage from "./Stage";
import { useDroppable } from "@dnd-kit/core";

const containerStyle = {
  background: "#dadada",
  padding: 10,
  margin: 10,
  flex: 1,
};

const Column = ({ id, stages }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} style={containerStyle}>
      <SortableContext
        items={stages.map((stage) => stage.id)}
        strategy={verticalListSortingStrategy}
      >
        {stages.map((stage) => {
          return <Stage key={stage.id} id={stage.id} title={stage.title} />;
        })}
      </SortableContext>
    </div>
  );
};

export default Column;
