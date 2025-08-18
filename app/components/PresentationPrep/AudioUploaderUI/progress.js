import React from "react";

export function Progress({ value }) {
  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "#ececf0",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: "#1976d2",
          transition: "width 0.3s",
        }}
      />
    </div>
  );
}
