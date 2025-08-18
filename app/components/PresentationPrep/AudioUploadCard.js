import React, { useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";

const AudioUploadCard = () => {
  const inputRef = useRef();

  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 540,
        margin: "2rem auto",
        padding: "2.5rem 1.5rem",
        border: "1.5px dashed #e0e0e0",
        borderRadius: "18px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#f3f3f5",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <CloudUploadIcon style={{ fontSize: 28, color: "#717182" }} />
      </div>
      <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 6 }}>
        Choose audio files to upload
      </div>
      <div style={{ color: "#717182", fontSize: 14, marginBottom: 22 }}>
        Supports MP3, WAV, FLAC, and other audio formats
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // handle file selection here
        }}
      />
      <button
        type="button"
        onClick={handleBrowseClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "1.5px solid #e0e0e0",
          borderRadius: 8,
          padding: "0.5rem 1.2rem",
          fontWeight: 500,
          fontSize: 15,
          color: "#222",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <AudiotrackIcon style={{ fontSize: 18 }} />
        Browse Files
      </button>
    </div>
  );
};

export default AudioUploadCard;
