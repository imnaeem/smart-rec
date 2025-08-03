"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Alert,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExternalLink, Share, X, MessageCircle, Info } from "lucide-react";

import type { Recording } from "@/lib/types/recording";
import { NativeVideoPlayer } from "./native-video-player";
import ShareRecordingDialog from "./share-recording-dialog";
import { VideoChatPanel } from "../chat/video-chat-panel";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";

// ReactPlayer removed - using native HTML5 player only

interface VideoPlayerModalProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
  isPublicView?: boolean;
  onRecordingUpdate?: () => void;
}

export function VideoPlayerModal({
  open,
  onClose,
  recording,
  isPublicView = false,
  onRecordingUpdate,
}: VideoPlayerModalProps) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [localRecording, setLocalRecording] = useState<Recording | null>(
    recording
  );

  // Always call the hook but handle gracefully when not available
  const { setCurrentVideo } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Update local recording state when prop changes
  useEffect(() => {
    setLocalRecording(recording);
  }, [recording]);
  const [activeTab, setActiveTab] = useState(0); // 0 = Info, 1 = Chat

  // Track if view count has been incremented for this session
  const viewCountIncrementedRef = useRef(false);

  // Track current video for notifications (only in authenticated views)
  useEffect(() => {
    if (!isPublicView) {
      if (open && recording) {
        setCurrentVideo(recording.id);
      } else {
        setCurrentVideo(null);
      }
    }
  }, [open, recording, setCurrentVideo, isPublicView]);

  // Increment view count when video starts playing
  const incrementViewCount = useCallback(async () => {
    if (!recording || viewCountIncrementedRef.current) {
      return;
    }

    try {
      const headers: HeadersInit = {};
      if (user) {
        const authToken = await user.getIdToken();
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`/api/recordings/${recording.id}/view`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        viewCountIncrementedRef.current = true;

        // Don't call onRecordingUpdate here to avoid infinite loop
        // The view count will be updated when the modal closes and recordings page refreshes
      } else {
        const errorData = await response.json();
        console.error("🔥 VIDEO: API error:", errorData);
      }
    } catch (error) {
      console.error("🔥 VIDEO: Failed to increment view count:", error);
    }
  }, [recording, user]);

  // Reset states when modal opens or recording changes
  useEffect(() => {
    if (open && recording) {
      setError(null);
      viewCountIncrementedRef.current = false; // Reset view count flag
      setActiveTab(0); // Reset to info tab on mobile
    }
  }, [open, recording]);

  // Increment view count once when modal opens with a recording
  useEffect(() => {
    if (open && recording && !viewCountIncrementedRef.current) {
      incrementViewCount();
    }
  }, [open, recording, incrementViewCount]);

  // Keyboard shortcuts - only ESC to close
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!open) return;

      // Only handle ESC key, ignore space/k so they work in chat input
      if (event.key === "Escape") {
        event.preventDefault();
        if (!isPublicView) {
          setCurrentVideo(null); // Clear current video when closing
        }
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [open, onClose, isPublicView, setCurrentVideo]);

  if (!recording) return null;

  const handleOpenInNewTab = () => {
    window.open(recording.videoUrl, "_blank");
  };

  const handleShare = () => {
    // Open the share dialog instead of native sharing
    setShareDialogOpen(true);
  };

  // Check if user owns the recording (can share it)
  const canShare =
    user && recording && recording.userId === user.uid && !isPublicView;

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "4k":
        return "#8b5cf6";
      case "1080p":
        return "#10b981";
      case "720p":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "white",
          color: "black",
          borderRadius: 3,
          overflow: "hidden",
          height: "96vh",
          maxHeight: "96vh",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
          pb: 1,
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "black",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
          }}
        >
          <X size={20} />
        </IconButton>

        {/* Main Content Area - YouTube-style Layout */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden",
            gap: 0,
          }}
        >
          {/* Left Side: Video and Info Content */}
          <Box
            sx={{
              width: isMobile
                ? "100%"
                : isPublicView
                ? "100%"
                : "calc(100% - 380px)",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* Video Player */}
            <Box
              sx={{
                position: "relative",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                height: isMobile ? "280px" : "600px",
                maxHeight: isMobile ? "280px" : "600px",
                width: "100%",
                borderRadius: 2,
                "& > div": {
                  borderRadius: 0,
                  width: "100%",
                  height: "100%",
                },
                "& video": {
                  display: "block !important",
                  width: "100% !important",
                  height: "100% !important",
                  objectFit: "contain",
                  borderRadius: "8px",
                },
              }}
            >
              {/* Error State */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    maxWidth: "80%",
                  }}
                >
                  Failed to load video: {error}
                </Alert>
              )}

              <NativeVideoPlayer
                videoUrl={localRecording?.videoUrl || ""}
                width={isMobile ? 480 : 900}
                height={isMobile ? 280 : 600}
                autoPlay={true}
                controls={true}
                onTimeUpdate={() => {
                  // Handle time updates if needed
                }}
                onDuration={() => {
                  // Handle duration updates if needed
                }}
                onPlay={() => {
                  setError(null);
                  incrementViewCount();
                }}
                onPause={() => {}}
              />
            </Box>

            {/* Action Buttons - Below Video */}
            {!isMobile && (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor: "white",
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  startIcon={<ExternalLink size={16} />}
                  onClick={handleOpenInNewTab}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#666",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  OPEN
                </Button>
                {canShare && (
                  <Button
                    startIcon={<Share size={16} />}
                    onClick={handleShare}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      "&:hover": {
                        borderColor: "#666",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    SHARE
                  </Button>
                )}
              </Box>
            )}

            {/* Mobile Tabs */}
            {isMobile && (
              <Box
                sx={{
                  backgroundColor: "white",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{
                    "& .MuiTab-root": {
                      minHeight: 48,
                      fontSize: "0.875rem",
                      color: "#666",
                      "&.Mui-selected": {
                        color: "#7c3aed",
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#7c3aed",
                    },
                  }}
                >
                  <Tab icon={<Info size={16} />} label="Info" />
                  {!isPublicView && (
                    <Tab icon={<MessageCircle size={16} />} label="Chat" />
                  )}
                </Tabs>
              </Box>
            )}

            {/* Video Info - Always visible on desktop, tab content on mobile */}
            {(!isMobile || activeTab === 0) && (
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: "white",
                  color: "#1a1a1a",
                  flex: isMobile ? "1" : "none",
                  overflow: "auto",
                  maxHeight: isMobile ? "auto" : "200px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, fontSize: "1rem" }}
                >
                  {localRecording?.title}
                </Typography>

                {localRecording?.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5, fontSize: "0.85rem" }}
                  >
                    {localRecording?.description}
                  </Typography>
                )}

                {/* Metadata chips */}
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 1 }}
                >
                  <Chip
                    label={localRecording?.quality.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getQualityColor(
                        localRecording?.quality || ""
                      ),
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: "24px",
                    }}
                  />
                  <Chip
                    label={`${localRecording?.fps} FPS`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: "24px" }}
                  />
                  <Chip
                    label={localRecording?.format.toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: "24px" }}
                  />
                  <Chip
                    label={formatFileSize(localRecording?.size || 0)}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: "24px" }}
                  />
                  <Chip
                    label={`${localRecording?.views} views`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: "24px" }}
                  />
                </Stack>

                {/* Tags */}
                {localRecording?.tags && localRecording.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Tags:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {localRecording?.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {/* Mobile Chat Tab Content */}
            {isMobile && activeTab === 1 && !isPublicView && (
              <Box sx={{ flex: 1, backgroundColor: "white" }}>
                {localRecording && (
                  <VideoChatPanel
                    recording={localRecording}
                    isPublicView={isPublicView}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Right Sidebar: Chat Panel (Desktop Only) - Hidden for public videos */}
          {!isMobile && !isPublicView && (
            <Box
              sx={{
                width: 380,
                height: "100%",
                backgroundColor: "white",
                borderLeft: "1px solid #e5e7eb",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {localRecording && (
                <VideoChatPanel
                  recording={localRecording}
                  isPublicView={isPublicView}
                  className="clean-chat"
                />
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <DialogActions
          sx={{
            backgroundColor: "white",
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Button
            startIcon={<ExternalLink size={16} />}
            onClick={handleOpenInNewTab}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#e0e0e0",
              color: "#666",
              "&:hover": {
                borderColor: "#666",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            OPEN
          </Button>
          {canShare && (
            <Button
              startIcon={<Share size={16} />}
              onClick={handleShare}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#e0e0e0",
                color: "#666",
                "&:hover": {
                  borderColor: "#666",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              SHARE
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#7c3aed",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#6d28d9",
              },
            }}
          >
            CLOSE
          </Button>
        </DialogActions>
      )}

      {/* Share Recording Dialog */}
      <ShareRecordingDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        recording={localRecording}
        onUpdate={() => {
          // Update local recording state without triggering parent reload
          setLocalRecording((prev) =>
            prev ? { ...prev, isPublic: !prev.isPublic } : null
          );
          // Only trigger parent update for view count changes, not public toggle
          // onRecordingUpdate?.(); // Commented out to prevent dialog reloading
        }}
      />
    </Dialog>
  );
}
