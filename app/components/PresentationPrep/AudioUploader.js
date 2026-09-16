import React, { useRef, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DeleteIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button } from "./AudioUploaderUI/button";
import { Progress } from "./AudioUploaderUI/progress";
import { Card } from "./AudioUploaderUI/card";
import { Badge } from "./AudioUploaderUI/badge";
import { Input } from "./AudioUploaderUI/input";
import { saveFile } from "@app/utils/indexedDBWrapper";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useLessonStore } from "@app/stores/useLessonStore";
import FileCard from "./AudioUploaderUI/filecard";
import { addFilePath } from "@app/utils/FilePathNameUtil";
import { listeningForGistandDetailStage } from "@app/utils/SectionIDs";
import { takeAwayFilePath } from "@app/utils/FilePathNameUtil";

const dummyArchive = [
  {
    id: 1,
    name: "Summer Vibes - Instrumental.mp3",
    size: "5 MB",
    duration: "3:24",
    date: "Jan 15, 2024",
    category: "Music",
    type: "mp3",
  },
  {
    id: 2,
    name: "Podcast Episode 42.wav",
    size: "24 MB",
    duration: "18:45",
    date: "Jan 10, 2024",
    category: "Podcast",
    type: "wav",
  },
  {
    id: 3,
    name: "Voice Memo – Meeting Notes.m4a",
    size: "1 MB",
    duration: "2:12",
    date: "Jan 8, 2024",
    category: "Voice Memo",
    type: "m4a",
  },
  {
    id: 4,
    name: "Background Music Loop.mp3",
    size: "3 MB",
    duration: "1:30",
    date: "Jan 5, 2024",
    category: "Music",
    type: "mp3",
  },
  {
    id: 5,
    name: "Interview Recording.flac",
    size: "43.01 MB",
    duration: "45:20",
    date: "Jan 3, 2024",
    category: "Interview",
    type: "flac",
  },
];

const TEAL = "#2f7d76";
const GRAY = "#8a857c";

export default function AudioUploader() {
  const [mode, setMode] = useState("upload"); // "upload" or "archive"
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [archiveFiles] = useState(dummyArchive);
  const [archiveSelected, setArchiveSelected] = useState([]);
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
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
  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);
  const updateAudioBucketContents = useAudioTextStore(
    (state) => state.updateAudioBucketContents,
  );
  const audioBucketContents = useAudioTextStore(
    (state) => state.audioBucketContents,
  );

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

  // Helper to upload file to  API route
  async function uploadToBucket(file, onProgress) {
    const formData = new FormData();
    const filePath = addFilePath(
      file.name,
      currentUserID,
      currentLessonID,
      listeningForGistandDetailStage,
    );
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    if (files.length > 0) {
      const file = files[0];
      setSelectedFiles([file]);
      updateSelectedAudioFileName(file.name);
      await saveFile(file.name, file);

      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      try {
        await uploadToBucket(file);

        setUploadProgress((prev) => ({ ...prev, [file]: 100 }));
        await getBucketContents();
      } catch (err) {
        setUploadProgress((prev) => ({ ...prev, [file]: 0 }));
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

  const filteredArchive = audioBucketContents.filter(
    (file) =>
      filter === "All Categories" ||
      (file === filter && file.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDrop = async (e) => {
    console.log("File dropped into audio uploader");

    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    if (files.length > 0) {
      const file = files[0];
      console.log("Dropped file: ", file);
      console.log("file name: ", file.name);

      setSelectedFiles([file]);
      updateSelectedAudioFileName(file.name);
      await saveFile(file.name, file);

      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      try {
        await uploadToBucket(file);
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
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
      <h1
        style={{
          textAlign: "center",
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 6,
          color: "#1c1c1e",
        }}
      >
        Audio
      </h1>
      <div
        style={{
          textAlign: "center",
          color: "#6f6b63",
          fontSize: 14,
          marginBottom: 18,
        }}
      >
        Upload a recording or pick one from your archive
      </div>

      {/* Segmented Upload / Archive toggle */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <div
          style={{
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

      {/* Selected file banner */}
      {selectedAudioFileName ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "0 auto 18px",
            maxWidth: 460,
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
      ) : null}

      {mode === "upload" ? (
        <>
          <Card
            style={{
              border: "1.5px dashed #9fe1cb",
              borderRadius: 16,
              background: isDragActive ? "#eef7f3" : "#f4faf8",
              padding: "1.75rem 1.5rem",
              marginBottom: 24,
              minHeight: 170,
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
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <CloudUploadIcon style={{ fontSize: 30, color: "#0f6e56" }} />
            </div>
            <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 6 }}>
              {isDragActive
                ? "Drop audio files here"
                : "Choose audio files to upload"}
            </div>
            <div style={{ color: GRAY, fontSize: 14, marginBottom: 22 }}>
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
                fontSize: 15,
                margin: "0 auto",
              }}
            >
              <AudiotrackIcon style={{ fontSize: 18 }} />
              Browse Files
            </Button>
          </Card>

          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>
                Selected Files{" "}
                <span style={{ color: GRAY, fontWeight: 400 }}>
                  {selectedFiles.length} file
                  {selectedFiles.length > 1 ? "s" : ""}
                </span>
              </div>
              {selectedFiles.map((file) => (
                <Card
                  key={file}
                  style={{
                    padding: "1rem",
                    marginBottom: 10,
                    borderRadius: 12,
                  }}
                >
                  <FileCard
                    file={file}
                    uploadProgress={uploadProgress[file] || 0}
                    onRemove={handleRemoveFile}
                  />
                </Card>
              ))}
              <Button
                variant="contained"
                color="primary"
                style={{
                  margin: "18px auto 0 auto",
                  display: "block",
                  fontWeight: 600,
                  borderRadius: 8,
                  minWidth: 220,
                }}
                startIcon={<AudiotrackIcon />}
                onClick={() => alert("Processing files...")}
              >
                Process Selected Files
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <Card
            style={{
              border: "1px solid #e6e3db",
              borderRadius: 16,
              background: "#fff",
              padding: "1.5rem 1.5rem 1rem 1.5rem",
              marginBottom: 24,
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
          {selectedArchiveId && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>
                Selected File
              </div>
              <Card key={selectedArchiveId}>
                <AudiotrackIcon style={{ fontSize: 28, color: GRAY }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{selectedArchiveId}</div>
                  <div style={{ color: GRAY, fontSize: 13 }}>
                    {selectedArchiveId}
                  </div>
                </div>
                <Button
                  variant="text"
                  onClick={() => setSelectedArchiveId(null)}
                  style={{
                    minWidth: 32,
                    minHeight: 32,
                    borderRadius: "50%",
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Card>
            </div>
          )}
          {archiveSelected.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>
                Selected Files{" "}
                <span style={{ color: GRAY, fontWeight: 400 }}>
                  {archiveSelected.length} file
                  {archiveSelected.length > 1 ? "s" : ""}
                </span>
              </div>
              {audioBucketContents
                .filter((file) => selectedArchiveId === file)
                .map((file) => (
                  <Card
                    key={file}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "1rem",
                      marginBottom: 10,
                      borderRadius: 12,
                    }}
                  >
                    <AudiotrackIcon style={{ fontSize: 28, color: GRAY }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{file}</div>
                      <div style={{ color: GRAY, fontSize: 13 }}>{file}</div>
                    </div>
                    <Button
                      variant="text"
                      onClick={() => handleArchiveSelect(file)}
                      style={{
                        minWidth: 32,
                        minHeight: 32,
                        borderRadius: "50%",
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Card>
                ))}
              <Button
                variant="contained"
                color="primary"
                style={{
                  margin: "18px auto 0 auto",
                  display: "block",
                  fontWeight: 600,
                  borderRadius: 8,
                  minWidth: 220,
                }}
                startIcon={<AudiotrackIcon />}
                onClick={() => alert("Processing files...")}
              >
                Process Selected Files
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
