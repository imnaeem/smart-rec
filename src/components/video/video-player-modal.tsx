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
} from "@mui/material";
import { ExternalLink, Share, X } from "lucide-react";

import type { Recording } from "@/lib/types/recording";
import { CloudinaryVideoPlayer } from "./cloudinary-video-player-wrapper";
import ShareRecordingDialog from "./share-recording-dialog";
import { useAuth } from "@/contexts/auth-context";

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
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Track if view count has been incremented for this session
  const viewCountIncrementedRef = useRef(false);

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
    }
  }, [open, recording]);

  // Increment view count once when modal opens with a recording
  useEffect(() => {
    if (open && recording && !viewCountIncrementedRef.current) {
      incrementViewCount();
    }
  }, [open, recording, incrementViewCount]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key.toLowerCase()) {
        case " ":
        case "k":
          event.preventDefault();
          break;
        case "escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [open, onClose]);

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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#000",
          color: "white",
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <X size={20} />
        </IconButton>

        {/* Modern Video Player */}
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#000",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            minHeight: "400px",
            "& > div": {
              borderRadius: 0,
            },
            "& video": {
              display: "block !important",
              visibility: "visible !important",
              opacity: "1 !important",
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

          <CloudinaryVideoPlayer
            publicId={recording.cloudinaryPublicId}
            width={800}
            height={450}
            autoPlay={true}
            controls={true}
            onTimeUpdate={(currentTime) => {
              // Handle time updates if needed
            }}
            onDuration={(duration) => {
              // Handle duration updates if needed
            }}
            onPlay={() => {
              setError(null);
            }}
            onPause={() => {}}
          />
        </Box>

        {/* Video info */}
        <Box sx={{ p: 3, backgroundColor: "white", color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {recording.title}
          </Typography>

          {recording.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {recording.description}
            </Typography>
          )}

          {/* Metadata chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            <Chip
              label={recording.quality.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getQualityColor(recording.quality),
                color: "white",
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${recording.fps} FPS`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={recording.format.toUpperCase()}
              size="small"
              variant="outlined"
            />
            <Chip
              label={formatFileSize(recording.size)}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${recording.views} views`}
              size="small"
              variant="outlined"
            />
          </Stack>

          {/* Tags */}
          {recording.tags && recording.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tags:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {recording.tags.map((tag, index) => (
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
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "white",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Helper text on the left */}
        <Box sx={{ color: "text.secondary" }}>
          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
            Shortcuts: Space/K = Play/Pause, Esc = Close
          </Typography>
        </Box>

        {/* Action buttons on the right */}
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
      </DialogActions>

      {/* Share Recording Dialog */}
      <ShareRecordingDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        recording={recording}
        onUpdate={onRecordingUpdate}
      />
    </Dialog>
  );
}
