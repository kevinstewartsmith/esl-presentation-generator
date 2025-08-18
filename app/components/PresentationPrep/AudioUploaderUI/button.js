import React from "react";

export function Button({
  children,
  variant,
  color,
  startIcon,
  style,
  ...props
}) {
  return (
    <button
      style={{
        background: variant === "contained" ? "#222" : "#fff",
        color: variant === "contained" ? "#fff" : "#222",
        border: variant === "outlined" ? "1.5px solid #e0e0e0" : "none",
        padding: "0.5rem 1.2rem",
        borderRadius: 8,
        fontWeight: 500,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
      {...props}
    >
      {startIcon}
      {children}
    </button>
  );
}
