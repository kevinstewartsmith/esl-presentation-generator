import React, { useRef, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DeleteIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArchiveIcon from "@mui/icons-material/Archive";
import UploadIcon from "@mui/icons-material/Upload";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Switch } from "./AudioUploaderUI/switch";
import { Button } from "./AudioUploaderUI/button";
import { Progress } from "./AudioUploaderUI/progress";
import { Card } from "./AudioUploaderUI/card";
import { Badge } from "./AudioUploaderUI/badge";
import { Input } from "./AudioUploaderUI/input";
import { saveFile } from "@app/utils/IndexedDBWrapper";
import { useLessonStore } from "@app/stores/UseLessonStore";
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

export default function AudioUploader() {
  const [mode, setMode] = useState("upload"); // "upload" or "archive"
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [archiveFiles] = useState(dummyArchive);
  const [archiveSelected, setArchiveSelected] = useState([]); // (You can remove this if not used elsewhere)
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Categories");
  const [isDragActive, setIsDragActive] = useState(false);
  const updateCompleteListeningStageData = useLessonStore(
    (state) => state.updateCompleteListeningStageData
  );
  const completeListeningStageData = useLessonStore(
    (state) => state.completeListeningStageData
  );

  const inputRef = useRef();

  const handleBrowseClick = () => {
    inputRef.current.click();
  };
  const currentUserID = useLessonStore((state) => state.currentUserID);
  const currentLessonID = useLessonStore((state) => state.currentLessonID);
  const updateAudioBucketContents = useLessonStore(
    (state) => state.updateAudioBucketContents
  );
  const audioBucketContents = useLessonStore(
    (state) => state.audioBucketContents
  );

  async function getBucketContents() {
    const response = await fetch("/api/get-audio-bucket-info");
    const data = await response.json();
    console.log("Bucket data in audio uploader: ", data);

    console.log(data);
    //updateBucketContents(data);
    updateAudioBucketContents(data);
  }

  useEffect(() => {
    if (!audioBucketContents || audioBucketContents.length === 0) {
      // async function getBucketContents() {
      //   const response = await fetch("/api/get-audio-bucket-info");
      //   const data = await response.json();
      //   console.log("Bucket data in audio uploader: ", data);

      //   console.log(data);
      //   //updateBucketContents(data);
      //   updateAudioBucketContents(data);
      // }
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
      listeningForGistandDetailStage
    );
    formData.append("audio", file, file.name);
    formData.append("filePath", filePath);

    // Optional: add fileName or other metadata if your API expects it
    // formData.append("fileName", file.name);

    const response = await fetch(
      "/api/firestore/gc-audio-bucket/upload-to-audio-bucket",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }
    return await response.json();
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("audio/")
    );
    if (files.length > 0) {
      const file = files[0];
      setSelectedFiles([file]);
      await saveFile(file.name, file); // <-- FIXED
      updateCompleteListeningStageData({
        ...completeListeningStageData,
        audioFileName: file.name,
      });
      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      // let progress = 0;
      // const interval = setInterval(() => {
      //   progress += Math.random() * 20;
      //   setUploadProgress((prev) => ({
      //     ...prev,
      //     [file.name]: Math.min(100, Math.floor(progress)),
      //   }));
      //   if (progress >= 100) clearInterval(interval);
      // }, 300);
      try {
        await uploadToBucket(file);

        setUploadProgress((prev) => ({ ...prev, [file]: 100 }));
        await getBucketContents();
        //updateAudioBucketContents([...audioBucketContents, file.name]);
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
    setSelectedArchiveId((prev) => (prev === fileName ? null : fileName));
  };

  const filteredArchive = audioBucketContents.filter(
    (file) =>
      filter === "All Categories" ||
      (file === filter && file.toLowerCase().includes(search.toLowerCase()))
  );

  // Add these handlers for drag-and-drop
  const handleDrop = async (e) => {
    console.log("File dropped into audio uploader");

    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("audio/")
    );
    if (files.length > 0) {
      const file = files[0];
      console.log("Dropped file: ", file);
      console.log("file name: ", file.name);

      setSelectedFiles([file]);
      //await saveFile(file, file); // <-- FIXED
      //await saveFile({ name: file.name, blob: file });
      updateCompleteListeningStageData({
        ...completeListeningStageData,
        audioFileName: file.name,
      });
      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [file]: 0 }));
      // let progress = 0;
      // const interval = setInterval(() => {
      //   progress += Math.random() * 20;
      //   setUploadProgress((prev) => ({
      //     ...prev,
      //     [file.name]: Math.min(100, Math.floor(progress)),
      //   }));
      //   if (progress >= 100) clearInterval(interval);
      // }, 300);

      // Upload to bucket
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 0" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        Audio Manager
      </h1>
      <div
        style={{
          textAlign: "center",
          color: "#717182",
          fontSize: 15,
          marginBottom: 18,
        }}
      >
        Upload new files or select from your archive
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <UploadIcon
          fontSize="small"
          style={{ opacity: mode === "upload" ? 1 : 0.5 }}
        />
        <Switch
          checked={mode === "archive"}
          onChange={() => setMode(mode === "upload" ? "archive" : "upload")}
        />
        <ArchiveIcon
          fontSize="small"
          style={{ opacity: mode === "archive" ? 1 : 0.5 }}
        />
      </div>

      {mode === "upload" ? (
        <>
          <Card
            style={{
              border: "1.5px dashed #e0e0e0",
              borderRadius: 16,
              background: isDragActive ? "#f3f3f5" : "#fff",
              padding: "2.5rem 1.5rem",
              marginBottom: 24,
              minHeight: 260,
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
                background: "#f3f3f5",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <CloudUploadIcon style={{ fontSize: 32, color: "#717182" }} />
            </div>
            <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 6 }}>
              {isDragActive
                ? "Drop audio files here"
                : "Choose audio files to upload"}
            </div>
            <div style={{ color: "#717182", fontSize: 14, marginBottom: 22 }}>
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
                <span style={{ color: "#717182", fontWeight: 400 }}>
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
              border: "1.5px solid #e0e0e0",
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
              <FolderOpenIcon style={{ marginRight: 8, color: "#717182" }} />
              <span style={{ fontWeight: 500, fontSize: 18 }}>
                Audio Archive
              </span>
              <span
                style={{ marginLeft: "auto", color: "#717182", fontSize: 14 }}
              >
                {audioBucketContents.length} files
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startAdornment={<SearchIcon style={{ color: "#717182" }} />}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                style={{ minWidth: 140, fontWeight: 500 }}
                onClick={() =>
                  setFilter(
                    filter === "All Categories" ? "Music" : "All Categories"
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
                    background: selectedArchiveId === file ? "#e9ebef" : "#fff",
                    border:
                      selectedArchiveId === file
                        ? "1.5px solid #1976d2"
                        : "1.5px solid #ececf0",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedArchiveId === file}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleArchiveSelect(file);
                    }}
                    style={{ accentColor: "#1976d2", marginRight: 8 }}
                  />
                  <AudiotrackIcon style={{ fontSize: 24, color: "#717182" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>
                      {takeAwayFilePath(file)}
                    </div>
                    {/* If you want to display more info, you'll need to parse it from the string or fetch metadata */}
                  </div>
                  {/* ...other UI elements... */}
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
                <AudiotrackIcon style={{ fontSize: 28, color: "#717182" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{selectedArchiveId}</div>
                  <div style={{ color: "#717182", fontSize: 13 }}>
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
                <span style={{ color: "#717182", fontWeight: 400 }}>
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
                    <AudiotrackIcon
                      style={{ fontSize: 28, color: "#717182" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{file}</div>
                      <div style={{ color: "#717182", fontSize: 13 }}>
                        {file}
                      </div>
                    </div>
                    <Button
                      variant="text"
                      onClick={() => handleArchiveSelect(`file-${index}`)}
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
