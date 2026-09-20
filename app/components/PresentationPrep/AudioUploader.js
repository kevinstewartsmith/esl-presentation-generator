import React, { useRef, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button } from "./AudioUploaderUI/button";
import { Card } from "./AudioUploaderUI/card";
import { Input } from "./AudioUploaderUI/input";
import { saveFile } from "@app/utils/indexedDBWrapper";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useLessonStore } from "@app/stores/useLessonStore";
import FileCard from "./AudioUploaderUI/filecard";
import { addFilePath } from "@app/utils/FilePathNameUtil";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import { takeAwayFilePath } from "@app/utils/FilePathNameUtil";

const TEAL = "#2f7d76";
const GRAY = "#8a857c";

export default function AudioUploader() {
  const [mode, setMode] = useState("upload"); // "upload" or "archive menu in uploader"
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Categories");
  const [isDragActive, setIsDragActive] = useState(false);

  const selectedAudioFileName = useAudioTextStore(
    (state) => state.selectedAudioFileName,
  );

  const updateSelectedAudioFileName = useAudioTextStore(
    (state) => state.updateSelectedAudioFileName,
  );

  const inputRef = useRef();

  const handleBrowseClick = () => {
    inputRef.current.click();
  };
  //User and lesson IDs for file pathing in bucket
  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);

  //Audio bucket contents for archive mode
  const updateAudioBucketContents = useAudioTextStore(
    (state) => state.updateAudioBucketContents,
  );
  const audioBucketContents = useAudioTextStore(
    (state) => state.audioBucketContents,
  );

  // Fetch the contents of the audio bucket from the server
  async function getBucketContents() {
    const response = await fetch("/api/get-audio-bucket-info");
    const data = await response.json();
    console.log("Bucket data in audio uploader: ", data);
    console.log(data);
    updateAudioBucketContents(data);
  }

  useEffect(() => {
    if (!audioBucketContents || audioBucketContents.length === 0) {
      getBucketContents();
    }
  }, []);

  async function ingestAudioFile(file) {
    const filePath = addFilePath(
      file.name,
      currentUserID,
      currentLessonID,
      listeningForGistandDetailStage,
    );
    await saveFile(filePath, file); // saveds audio to local cache
    await uploadToBucket(file, filePath); // uploads audio to bucket
    updateSelectedAudioFileName(filePath); // canonical key into store
    return filePath;
  }

  async function uploadToBucket(file, filePath) {
    const formData = new FormData();

    formData.append("audio", file, file.name);
    formData.append("filePath", filePath);

    const response = await fetch(
      "/api/firestore/gc-audio-bucket/upload-to-audio-bucket",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  }
  //Handle file selection from file input (clicking "Browse Files" button and selecting a file )
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    if (files.length > 0) {
      const file = files[0];
      setSelectedFiles([file]);

      // on upload start — a visible starting value so the bar appears "in progress"
      setUploadProgress((prev) => ({ ...prev, [file.name]: 15 }));
      try {
        //await uploadToBucket(file);
        await ingestAudioFile(file);
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 })); // success → fill to 100
        await getBucketContents();
      } catch (err) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
        alert("Upload failed: " + err.message);
      }
    }
  };

  const handleRemoveFile = (fileName) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[fileName];
      return copy;
    });
  };

  const handleArchiveSelect = (fileName) => {
    updateSelectedAudioFileName(fileName);
  };
  //Handles drag and drop of audio files into the uploader
  const handleDrop = async (e) => {
    console.log("File dropped into audio uploader");
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    if (files.length > 0) {
      const file = files[0];
      setSelectedFiles([file]);
      setUploadProgress((prev) => ({ ...prev, [file.name]: 15 }));
      try {
        await ingestAudioFile(file);
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 })); // success → fill to 100
        await getBucketContents();
      } catch (err) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
        alert("Upload failed: " + err.message);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const segBtn = (active) => ({
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    padding: "5px 16px",
    borderRadius: 6,
    background: active ? "#fff" : "transparent",
    color: active ? TEAL : GRAY,
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
  });

  // Selected-audio banner (reused in both modes)
  const SelectedBanner = () =>
    selectedAudioFileName ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          background: "#fff",
          border: "1px solid #bfe5d7",
          borderRadius: 12,
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: TEAL,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i
            className="ti ti-music"
            style={{ fontSize: 18 }}
            aria-hidden="true"
          />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#0f6e56",
              fontWeight: 700,
            }}
          >
            Selected audio
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#1c1c1e",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedAudioFileName.split("/").pop()}
          </div>
        </div>
        <i
          className="ti ti-circle-check-filled"
          style={{ fontSize: 22, color: TEAL, flexShrink: 0 }}
          aria-hidden="true"
        />
      </div>
    ) : null;

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "#fff",
        border: "1px solid #e6e3db",
        borderRadius: 14,
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        padding: "16px 20px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header row: chip + label + segmented toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#e1f5ee",
            color: "#0f6e56",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i
            className="ti ti-music"
            style={{ fontSize: 14 }}
            aria-hidden="true"
          />
        </span>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#1c1c1e" }}>
          Audio
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 4,
            background: "#f1efe8",
            borderRadius: 8,
            padding: 3,
          }}
        >
          <button
            onClick={() => setMode("upload")}
            style={segBtn(mode === "upload")}
          >
            Upload
          </button>
          <button
            onClick={() => setMode("archive")}
            style={segBtn(mode === "archive")}
          >
            Archive
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <>
          {/* Banner + dropzone side by side (equal-ish columns) — no pyramid.
              When no file is selected, the dropzone spans full width. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedAudioFileName ? "1fr 1.3fr" : "1fr",
              gap: 14,
              alignItems: "stretch",
              marginBottom: 20,
            }}
          >
            <SelectedBanner />

            <Card
              style={{
                border: "1.5px dashed #9fe1cb",
                borderRadius: 16,
                background: isDragActive ? "#eef7f3" : "#f4faf8",
                padding: "1.5rem",
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragLeave}
            >
              <div
                style={{
                  background: "#e1f5ee",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <CloudUploadIcon style={{ fontSize: 26, color: "#0f6e56" }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                {isDragActive
                  ? "Drop audio files here"
                  : "Choose audio files to upload"}
              </div>
              <div style={{ color: GRAY, fontSize: 13, marginBottom: 14 }}>
                Supports MP3 audio formats
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                style={{ display: "none" }}
                multiple
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                onClick={handleBrowseClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 500,
                  fontSize: 14,
                  margin: "0 auto",
                }}
              >
                <AudiotrackIcon style={{ fontSize: 18 }} />
                Browse Files
              </Button>
            </Card>
          </div>

          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>
                Selected Files{" "}
                <span style={{ color: GRAY, fontWeight: 400 }}>
                  {selectedFiles.length} file
                  {selectedFiles.length > 1 ? "s" : ""}
                </span>
              </div>
              {selectedFiles.map((file) => (
                <Card
                  key={file.name}
                  style={{
                    padding: "1rem",
                    marginBottom: 10,
                    borderRadius: 12,
                  }}
                >
                  <FileCard
                    file={file}
                    uploadProgress={uploadProgress[file.name] || 0}
                    onRemove={handleRemoveFile}
                  />
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Archive mode: banner on top (stacked is fine — list below is tall) */}
          {selectedAudioFileName ? (
            <div style={{ marginBottom: 16 }}>
              <SelectedBanner />
            </div>
          ) : null}

          <Card
            style={{
              border: "1px solid #e6e3db",
              borderRadius: 16,
              background: "#fff",
              padding: "1.25rem 1.25rem 0.75rem 1.25rem",
              minHeight: 320,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <FolderOpenIcon style={{ marginRight: 8, color: GRAY }} />
              <span style={{ fontWeight: 500, fontSize: 18 }}>
                Audio Archive
              </span>
              <span style={{ marginLeft: "auto", color: GRAY, fontSize: 14 }}>
                {audioBucketContents.length} files
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startAdornment={<SearchIcon style={{ color: GRAY }} />}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                style={{ minWidth: 140, fontWeight: 500 }}
                onClick={() =>
                  setFilter(
                    filter === "All Categories" ? "Music" : "All Categories",
                  )
                }
              >
                {filter === "All Categories" ? "All Categories" : filter}
              </Button>
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {audioBucketContents.map((file) => (
                <Card
                  key={file}
                  onClick={() => handleArchiveSelect(file)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0.8rem",
                    marginBottom: 10,
                    borderRadius: 10,
                    background:
                      selectedAudioFileName === file ? "#eef7f3" : "#fff",
                    border:
                      selectedAudioFileName === file
                        ? `1.5px solid ${TEAL}`
                        : "1px solid #ececf0",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedAudioFileName === file}
                    readOnly
                    style={{
                      accentColor: TEAL,
                      marginRight: 8,
                      pointerEvents: "none",
                    }}
                  />
                  <AudiotrackIcon style={{ fontSize: 24, color: GRAY }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>
                      {takeAwayFilePath(file)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
