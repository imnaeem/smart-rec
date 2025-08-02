"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Video,
  Monitor,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Pause,
  Settings,
  Check,
  AlertTriangle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { workerUploadService } from "@/lib/services/worker-upload-service";
import type { RecordingMetadata } from "@/lib/types/recording";
import { useAuth } from "@/contexts/auth-context";

export default function RecordPage() {
  const { user, loading } = useAuth();
  const [micEnabled, setMicEnabled] = useState(true);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(true);
  const [quality, setQuality] = useState<"720p" | "1080p">("1080p");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [systemAudioSupported, setSystemAudioSupported] = useState<
    boolean | null
  >(null);
  const [pauseResumeSupported, setPauseResumeSupported] = useState<
    boolean | null
  >(null);

  const metadata: RecordingMetadata = {
    recordingType: "screen", // Always screen since browser picker handles selection
    micEnabled,
    systemAudioEnabled,
    quality,
    fps: 30,
  };

  // Generate auto name with date
  const generateRecordingName = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `Recording ${date} at ${time}`;
  };

  const {
    isRecording,
    isPaused,
    formattedTime,
    error,
    recordedBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    isSupported,
  } = useMediaRecorder({
    metadata,
    onRecordingComplete: (blob, duration) => {
      console.log("Recording complete:", { blob, duration });
      handleAutoSave(blob, duration);
    },
    onError: (error) => {
      console.error("Recording error:", error);
    },
  });

  const handleAutoSave = async (blob: Blob, duration: number) => {
    if (!user) return;

    try {
      // Check file size before attempting upload
      const fileSizeMB = blob.size / (1024 * 1024);
      console.log(`Recording size: ${fileSizeMB.toFixed(1)}MB`);

      // Auto-generate recording name with current date/time
      const autoTitle = generateRecordingName();
      const autoDescription = `Size: ${fileSizeMB.toFixed(1)}MB`;

      // Create immediate placeholder recording
      const recordingId = workerUploadService.createImmediateRecording(
        autoTitle,
        autoDescription,
        metadata,
        duration
      );

      // Start background upload immediately in Web Worker
      const taskId = await workerUploadService.addUploadTask(
        autoTitle,
        autoDescription,
        blob,
        metadata
      );

      console.log(
        "Auto-upload started in worker:",
        taskId,
        "for recording:",
        recordingId
      );

      // Log memory usage
      const memoryInfo = await workerUploadService.getMemoryInfo();
      console.log("Worker memory usage:", memoryInfo.usage);

      setUploadSuccess(true);

      // Show success message and redirect immediately
      setTimeout(() => {
        setUploadSuccess(false);
        window.location.href = "/dashboard/recordings";
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  // Check basic MediaRecorder support without requesting permissions
  useEffect(() => {
    const checkBasicSupport = () => {
      // Check if MediaRecorder API is available
      if (typeof MediaRecorder !== "undefined") {
        // Create a dummy MediaRecorder to check for pause/resume support
        // Use a minimal audio context to avoid permission requests
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const destination = audioContext.createMediaStreamDestination();
          oscillator.connect(destination);

          const testRecorder = new MediaRecorder(destination.stream);
          setPauseResumeSupported(
            typeof testRecorder.pause === "function" &&
              typeof testRecorder.resume === "function"
          );

          // Clean up
          oscillator.disconnect();
          audioContext.close();
        } catch (error) {
          console.warn("Could not check MediaRecorder support:", error);
          setPauseResumeSupported(false);
        }
      } else {
        setPauseResumeSupported(false);
      }

      // Set system audio as potentially supported (will be checked during actual recording)
      setSystemAudioSupported(true);
    };

    if (
      typeof window !== "undefined" &&
      navigator.mediaDevices?.getDisplayMedia
    ) {
      checkBasicSupport();
    }
  }, []);

  // Enhanced reload protection and keyboard shortcuts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue =
          "Recording in progress! If you leave now, your recording will be lost. Are you sure?";
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (isRecording && document.hidden) {
        // Update page title to show recording continues in background
        document.title = "🔴 Recording (Background) - SmartRec";
      } else if (isRecording && !document.hidden) {
        document.title = "🔴 Recording - SmartRec";
      }
    };

    // Keyboard shortcuts for recording controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl+Shift+S: Start/Stop recording
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!isRecording && isSupported) {
          startRecording();
        } else if (isRecording) {
          stopRecording();
        }
      }

      // Ctrl+Shift+P: Pause/Resume recording (only if supported)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (isRecording && pauseResumeSupported !== false) {
          pauseRecording();
        }
      }

      // Space: Start recording if not recording, or pause/resume if recording
      if (e.key === " " && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        if (!isRecording && isSupported) {
          startRecording();
        } else if (isRecording && pauseResumeSupported !== false) {
          pauseRecording();
        }
      }

      // Escape: Stop recording
      if (e.key === "Escape" && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);

    // Update page title when recording starts/stops
    if (isRecording) {
      document.title = "🔴 Recording - SmartRec";
    } else {
      document.title = "SmartRec";
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.title = "SmartRec";
    };
  }, [isRecording, isSupported, startRecording, stopRecording, pauseRecording]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 4 }}>
          Please log in to access recording features.
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        {!isSupported && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Screen recording is not supported in this browser. Please use
            Chrome, Firefox, or Edge.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {uploadSuccess && (
          <Alert severity="success" icon={<Check />} sx={{ mb: 4 }}>
            Recording automatically saved and uploading! Your video will appear
            in the recordings section once processing is complete.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Recording Settings */}
          <Box>
            {/* Recording Tips */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Recording Tips
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Monitor size={20} color="#a855f7" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Choose what to record
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        When you start recording, you'll be able to choose
                        between entire screen, application window, or browser
                        tab
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Settings size={20} color="#10b981" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Optimize your setup
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Close unnecessary applications and ensure good lighting
                        for the best recording quality
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AlertTriangle size={20} color="#f59e0b" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Keep this tab open
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Don't close or reload this tab during recording - your
                        recording will be automatically saved when finished
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Audio Settings
                </Typography>
                <Stack spacing={3}>
                  {/* Microphone */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {micEnabled ? (
                        <Mic size={20} color="#10b981" />
                      ) : (
                        <MicOff size={20} color="#ef4444" />
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Microphone
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Record your voice narration
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={micEnabled}
                      onChange={(e) => setMicEnabled(e.target.checked)}
                      disabled={isRecording}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#a855f7",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#a855f7",
                          },
                        "& .MuiSwitch-switchBase.Mui-disabled": {
                          color: "#d1d5db",
                        },
                        "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track":
                          {
                            backgroundColor: "#e5e7eb",
                          },
                      }}
                    />
                  </Box>

                  {/* System Audio */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {systemAudioEnabled ? (
                        <Volume2 size={20} color="#10b981" />
                      ) : (
                        <VolumeX size={20} color="#ef4444" />
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          System Audio
                          {systemAudioSupported === false && (
                            <Chip
                              label="Not Supported"
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: "#fef3c7",
                                color: "#d97706",
                                fontSize: "0.65rem",
                                height: 20,
                              }}
                            />
                          )}
                          {systemAudioSupported === true && (
                            <Chip
                              label="Supported"
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: "#d1fae5",
                                color: "#059669",
                                fontSize: "0.65rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {systemAudioSupported === false
                            ? "System audio not available in this browser/OS"
                            : "Record computer sounds"}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={systemAudioEnabled}
                      onChange={(e) => setSystemAudioEnabled(e.target.checked)}
                      disabled={systemAudioSupported === false || isRecording}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#a855f7",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#a855f7",
                          },
                        "& .MuiSwitch-switchBase.Mui-disabled": {
                          color: "#d1d5db",
                        },
                        "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track":
                          {
                            backgroundColor: "#e5e7eb",
                          },
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Recording Quality */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Recording Quality
                </Typography>

                {/* Quality Selection */}
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Video Quality
                  </FormLabel>
                  <RadioGroup
                    value={quality}
                    onChange={(e) =>
                      setQuality(e.target.value as "720p" | "1080p")
                    }
                    row
                  >
                    <FormControlLabel
                      value="720p"
                      control={
                        <Radio
                          sx={{ color: "#a855f7" }}
                          disabled={isRecording}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: isRecording ? "#9ca3af" : "inherit" }}
                          >
                            720p HD
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Good quality, smaller file size
                          </Typography>
                        </Box>
                      }
                      disabled={isRecording}
                    />
                    <FormControlLabel
                      value="1080p"
                      control={
                        <Radio
                          sx={{ color: "#a855f7" }}
                          disabled={isRecording}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: isRecording ? "#9ca3af" : "inherit" }}
                          >
                            1080p Full HD
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Best quality, larger file size
                          </Typography>
                        </Box>
                      }
                      disabled={isRecording}
                    />
                  </RadioGroup>
                </FormControl>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={quality.toUpperCase()}
                    variant="filled"
                    sx={{
                      backgroundColor: "#a855f7",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label="30 FPS"
                    variant="outlined"
                    sx={{ borderColor: "#d1d5db", color: "#6b7280" }}
                  />
                  <Chip
                    label="WebM/MP4 Format"
                    variant="outlined"
                    sx={{ borderColor: "#d1d5db", color: "#6b7280" }}
                  />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Professional quality recording optimized for sharing and
                  viewing. Higher quality results in larger file sizes.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Recording Preview/Controls */}
          <Box>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                borderRadius: 3,
                height: "fit-content",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Recording Controls
                </Typography>

                {!isRecording ? (
                  // Start Recording
                  <Box textAlign="center">
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: "#f3e8ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        cursor: isSupported ? "pointer" : "not-allowed",
                        opacity: isSupported ? 1 : 0.5,
                        "&:hover": {
                          backgroundColor: isSupported ? "#e9d5ff" : "#f3e8ff",
                        },
                      }}
                      onClick={isSupported ? startRecording : undefined}
                    >
                      <Video size={48} color="#a855f7" />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Ready to Record
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Click the icon above or use the button below to start
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Play size={20} />}
                      onClick={startRecording}
                      disabled={!isSupported}
                      sx={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "#9333ea" },
                      }}
                    >
                      Start Recording
                    </Button>
                  </Box>
                ) : (
                  // Recording Controls
                  <Box textAlign="center">
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: isPaused ? "#fef3c7" : "#fee2e2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        position: "relative",
                      }}
                    >
                      {!isPaused && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%": { transform: "scale(1)", opacity: 1 },
                              "50%": { transform: "scale(1.1)", opacity: 0.7 },
                              "100%": { transform: "scale(1)", opacity: 1 },
                            },
                          }}
                        />
                      )}
                      <Square
                        size={48}
                        color={isPaused ? "#f59e0b" : "#ef4444"}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{ mb: 1, fontWeight: 700, color: "#1a1a1a" }}
                    >
                      {formattedTime}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 3, color: isPaused ? "#f59e0b" : "#ef4444" }}
                    >
                      {isPaused ? "Recording Paused" : "Recording..."}
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                      {pauseResumeSupported !== false && (
                        <Button
                          variant="outlined"
                          startIcon={
                            isPaused ? <Play size={18} /> : <Pause size={18} />
                          }
                          onClick={pauseRecording}
                          sx={{
                            borderColor: "#e5e7eb",
                            color: "#6b7280",
                            "&:hover": { borderColor: "#d1d5db" },
                          }}
                        >
                          {isPaused ? "Resume" : "Pause"}
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<Square size={18} />}
                        onClick={stopRecording}
                        sx={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          "&:hover": { backgroundColor: "#dc2626" },
                        }}
                      >
                        Stop
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* Tips */}
                <Alert
                  severity="info"
                  sx={{
                    mt: 3,
                    backgroundColor: "#f0f9ff",
                    borderColor: "#bae6fd",
                    "& .MuiAlert-icon": { color: "#0ea5e9" },
                  }}
                >
                  <Typography variant="body2">
                    <strong>Keyboard Shortcuts:</strong> Ctrl+Shift+S
                    (Start/Stop),
                    {pauseResumeSupported !== false && (
                      <>Ctrl+Shift+P (Pause/Resume), </>
                    )}
                    Space (Start
                    {pauseResumeSupported !== false ? " or Pause/Resume" : ""}),
                    Escape (Stop recording)
                    {pauseResumeSupported === false && (
                      <>
                        <br />
                        <em>
                          Note: Pause/Resume not supported in this browser
                        </em>
                      </>
                    )}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
