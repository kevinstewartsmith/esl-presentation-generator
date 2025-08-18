import React from "react";

export function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        border: "1.5px solid #ececf0",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
