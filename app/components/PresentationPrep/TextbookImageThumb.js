import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";

export function TextbookImageThumb({ file, onDelete }) {
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      key={file.name}
    >
      <img
        src={file.preview}
        alt={file.name}
        style={{
          height: 120,
          borderRadius: 8,
        }}
      />
      <IconButton
        size="small"
        onClick={() => onDelete(file)}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "white",
          boxShadow: 1,
          "&:hover": { background: "#eee" },
        }}
      >
        <CancelIcon fontSize="small" color="error" />
      </IconButton>
    </div>
  );
}
