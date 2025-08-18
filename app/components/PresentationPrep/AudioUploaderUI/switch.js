import React from "react";

export function Switch({ checked, onChange }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: 36,
          height: 20,
          background: checked ? "#1976d2" : "#ececf0",
          borderRadius: 12,
          position: "relative",
          display: "inline-block",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: checked ? 18 : 2,
            top: 2,
            width: 16,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            transition: "left 0.2s",
          }}
        />
      </span>
    </label>
  );
}
