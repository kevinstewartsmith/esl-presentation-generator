import React from "react";

export function Input({ startAdornment, style, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#f3f3f5",
        borderRadius: 8,
        padding: "0.4rem 0.8rem",
        border: "1.5px solid #ececf0",
        ...style,
      }}
    >
      {startAdornment && (
        <span style={{ marginRight: 6 }}>{startAdornment}</span>
      )}
      <input
        style={{
          border: "none",
          background: "transparent",
          outline: "none",
          fontSize: 15,
          flex: 1,
        }}
        {...props}
      />
    </div>
  );
}
