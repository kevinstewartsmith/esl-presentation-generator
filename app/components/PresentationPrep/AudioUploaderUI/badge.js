import React from "react";

export function Badge({ children, style }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2em 0.7em",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 500,
        background: "#ececf0",
        color: "#222",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
