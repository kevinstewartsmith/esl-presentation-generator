import React, { useRef, useState, useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Close";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { Progress } from "./progress";
import { Button } from "./button";

export default function FileCard({ file, uploadProgress, onRemove }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef();

  // Create object URL only once per file
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {uploadProgress < 100 ? (
        <AudiotrackIcon style={{ fontSize: 28, color: "#717182" }} />
      ) : (
        <Button
          variant="text"
          onClick={handlePlayPause}
          style={{ minWidth: 32, minHeight: 32, borderRadius: "50%" }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500 }}>{file.name}</div>
        <div style={{ color: "#717182", fontSize: 13 }}>
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </div>
        <div style={{ marginTop: 6 }}>
          {uploadProgress < 100 ? (
            <Progress value={uploadProgress} />
          ) : (
            <Progress
              value={audioDuration ? (audioProgress / audioDuration) * 100 : 0}
            />
          )}
          <div style={{ fontSize: 12, color: "#717182", marginTop: 2 }}>
            {uploadProgress < 100
              ? `Uploading... ${uploadProgress || 0}%`
              : `${Math.floor(audioProgress)} / ${Math.floor(
                  audioDuration
                )} sec`}
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setAudioProgress(e.target.currentTime)}
        onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
      <Button
        variant="text"
        onClick={() => onRemove(file.name)}
        style={{ minWidth: 32, minHeight: 32, borderRadius: "50%" }}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
}
