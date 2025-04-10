import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./sortable_item";

const containerStyle = {
  background: "lightgrey",
  //background:"blue",
  padding: 10,
  margin: 10,
  flex: 1,
  borderRadius: 10,
};

export default function Container(props) {
  const { id, items } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items || []}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}>
        {items ? items.map((id) => <SortableItem key={id} id={id} />) : null}
      </div>
    </SortableContext>
  );
}
