import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./sortable_item";

// `title` and `variant` are pure presentation (optional). Drag wiring unchanged.
export default function Container(props) {
  const { id, items, title, variant = "lesson" } = props;

  const { setNodeRef } = useDroppable({ id });

  const isLesson = variant === "lesson";

  const columnStyle = { flex: 1, minWidth: 0, margin: 10 };

  const headingStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 17,
    fontWeight: 600,
    color: "#1c1c1e",
  };

  const countStyle = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 12,
    color: "#8a857c",
    background: "#f0eee8",
    padding: "2px 10px",
    borderRadius: 20,
    fontWeight: 500,
  };

  const dropStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 340,
    padding: 10,
    borderRadius: 12,
    background: isLesson ? "#f6f4ee" : "transparent",
    border: isLesson ? "1px dashed #d8d4cb" : "none",
  };

  return (
    <div style={columnStyle}>
      {title ? (
        <div style={headingStyle}>
          <span>{title}</span>
          {isLesson ? (
            <span style={countStyle}>
              {(items?.length ?? 0)}{" "}
              {(items?.length ?? 0) === 1 ? "stage" : "stages"}
            </span>
          ) : null}
        </div>
      ) : null}

      <SortableContext
        id={id}
        items={items || []}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} style={dropStyle}>
          {items ? items.map((id) => <SortableItem key={id} id={id} />) : null}
        </div>
      </SortableContext>
    </div>
  );
}
