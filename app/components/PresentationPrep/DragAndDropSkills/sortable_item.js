import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { stageIdentity } from "./stageIdentity";

// PURE VISUAL. Renders the stage card. `id` is the stage name string.
export function Item(props) {
  const { id } = props;
  const ident = stageIdentity(id);

  const cardStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minHeight: 52,
    boxSizing: "border-box",
    padding: "12px 14px",
    background: "#fff",
    border: "0.5px solid #e6e3db",
    borderLeft: `3px solid ${ident.accent}`,
    borderRadius: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  const gripStyle = { color: "#c9c5bc", fontSize: 18, flexShrink: 0 };

  const chipStyle = {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: ident.chipBg,
    color: ident.icon,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const labelStyle = {
    flex: 1,
    minWidth: 0,
    fontWeight: 600,
    fontSize: 14,
    color: "#1c1c1e",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div style={cardStyle}>
      <i className="ti ti-grip-vertical" style={gripStyle} aria-hidden="true" />
      <span style={chipStyle}>
        <i className={`ti ${ident.ti}`} style={{ fontSize: 16 }} aria-hidden="true" />
      </span>
      <span style={labelStyle}>{id}</span>
    </div>
  );
}

// LOAD-BEARING: drag wiring untouched. Only the inner <Item> is restyled.
export default function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "8px 0",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} />
    </div>
  );
}
