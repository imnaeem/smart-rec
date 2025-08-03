"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Play,
  Pause,
  Scissors,
  RotateCcw,
  Download,
  X,
  Save,
} from "lucide-react";
import { Recording } from "@/lib/types/recording";

interface VideoEditorProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
  onSave: (
    editedBlob: Blob,
    startTime: number,
    endTime: number
  ) => Promise<void>;
}

export function VideoEditor({
  open,
  onClose,
  recording,
  onSave,
}: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize editor when recording changes
  useEffect(() => {
    if (recording && open) {
      setStartTime(0);
      setEndTime(recording.duration);
      setCurrentTime(0);
      setDuration(recording.duration);
      setIsPlaying(false);
      setIsEditing(false);
      setError(null);
    }
  }, [recording, open]);

  // Handle video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setEndTime(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const handleStartTimeChange = (value: number) => {
    setStartTime(value);
    if (value >= endTime) {
      setEndTime(Math.min(value + 1, duration));
    }
  };

  const handleEndTimeChange = (value: number) => {
    setEndTime(value);
    if (value <= startTime) {
      setStartTime(Math.max(value - 1, 0));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setStartTime(0);
    setEndTime(duration);
    setCurrentTime(0);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }
  };

  const handlePreview = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = startTime;
    video.play();
    setIsPlaying(true);

    // Stop at end time
    const checkEndTime = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        setIsPlaying(false);
      } else {
        requestAnimationFrame(checkEndTime);
      }
    };
    checkEndTime();
  };

  const handleSave = async () => {
    if (!recording) return;

    try {
      setIsSaving(true);
      setError(null);

      // For now, we'll use a simpler approach that creates a trimmed video
      // by downloading the original and processing it client-side

      // Fetch the original video
      const response = await fetch(recording.videoUrl);
      const originalBlob = await response.blob();

      // Create a new video element for processing
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = URL.createObjectURL(originalBlob);
      video.muted = true;

      await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", resolve);
        video.addEventListener("error", reject);
        video.load();
      });

      // Set up canvas for frame extraction
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not available");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Create MediaRecorder for the trimmed video
      const stream = canvas.captureStream(30); // 30 FPS

      // Try different MIME types for better compatibility
      let mimeType = "video/webm";

      // Prefer codecs with explicit audio support for canvas streams
      const preferredMimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];

      for (const type of preferredMimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error("No supported video codec found");
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const editedBlob = new Blob(chunks, { type: mimeType });
        await onSave(editedBlob, startTime, endTime);
        setIsSaving(false);
      };

      // Start recording
      mediaRecorder.start();

      // Process video frames
      let currentFrameTime = startTime;
      const frameInterval = 1000 / 30; // 30 FPS

      const processFrame = () => {
        if (currentFrameTime >= endTime) {
          mediaRecorder.stop();
          return;
        }

        video.currentTime = currentFrameTime;
        video.addEventListener(
          "seeked",
          () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            currentFrameTime += frameInterval / 1000;
            requestAnimationFrame(processFrame);
          },
          { once: true }
        );
      };

      processFrame();
    } catch (err) {
      console.error("Video editing error:", err);
      setError(err instanceof Error ? err.message : "Failed to edit video");
      setIsSaving(false);
    }
  };

  if (!recording) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !isSaving && onClose()}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Scissors size={24} color="#a855f7" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Edit Video: {recording.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isSaving} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 3, height: "60vh" }}>
          {/* Video Preview */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Preview
            </Typography>
            <Box
              sx={{
                position: "relative",
                flex: 1,
                backgroundColor: "#000",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <video
                ref={videoRef}
                src={recording.videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                muted
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/Pause Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: isPlaying ? 0 : 0.8,
                  transition: "opacity 0.2s",
                }}
              >
                <IconButton
                  onClick={handlePlayPause}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                  }}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </IconButton>
              </Box>
            </Box>

            {/* Video Controls */}
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <IconButton onClick={handlePlayPause} size="small">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </IconButton>
                <Typography variant="caption" sx={{ minWidth: 80 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>

              <Slider
                value={currentTime}
                onChange={(_, value) => handleSeek(value as number)}
                min={0}
                max={duration}
                step={0.1}
                size="small"
                sx={{ color: "#a855f7" }}
              />
            </Box>
          </Box>

          {/* Editing Controls */}
          <Box
            sx={{
              width: 300,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Trim Video
            </Typography>

            {/* Start Time */}
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                Start Time: {formatTime(startTime)}
              </Typography>
              <Slider
                value={startTime}
                onChange={(_, value) => handleStartTimeChange(value as number)}
                min={0}
                max={duration}
                step={0.1}
                size="small"
                sx={{ color: "#10b981" }}
              />
            </Box>

            {/* End Time */}
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                End Time: {formatTime(endTime)}
              </Typography>
              <Slider
                value={endTime}
                onChange={(_, value) => handleEndTimeChange(value as number)}
                min={0}
                max={duration}
                step={0.1}
                size="small"
                sx={{ color: "#ef4444" }}
              />
            </Box>

            {/* Duration Info */}
            <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                Trim Duration
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#a855f7" }}
              >
                {formatTime(endTime - startTime)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Original: {formatTime(duration)}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RotateCcw size={16} />}
                onClick={handleReset}
                disabled={isSaving}
                fullWidth
              >
                Reset
              </Button>

              <Button
                variant="outlined"
                startIcon={<Play size={16} />}
                onClick={handlePreview}
                disabled={isSaving}
                fullWidth
              >
                Preview Trim
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Hidden canvas for video processing */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isSaving} sx={{ color: "#666" }}>
          Cancel
        </Button>
        <Tooltip title="Coming soon">
          <Button
            onClick={handleSave}
            disabled={true}
            variant="contained"
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Save size={16} />
              )
            }
            sx={{
              backgroundColor: "#a855f7",
              "&:hover": { backgroundColor: "#9333ea" },
              "&:disabled": { backgroundColor: "#e9d5ff" },
            }}
          >
            {isSaving ? "Saving..." : "Save Edited Video"}
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
