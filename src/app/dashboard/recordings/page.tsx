"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Plus,
  Video,
  Play,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Share,
  Eye,
  Calendar,
  HardDrive,
  Globe,
  Lock,
  Monitor,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useRouter } from "next/navigation";
import { RecordingUploadService } from "@/lib/services/recording-upload";
import type { Recording } from "@/lib/types/recording";
import { useAuth } from "@/contexts/auth-context";
import { VideoEditor } from "@/components/video/video-editor";
import { RenameRecordingDialog } from "@/components/video/rename-recording-dialog";
import ShareRecordingDialog from "@/components/video/share-recording-dialog";
import { VideoPlayerModal } from "@/components/video/video-player-modal";
import { VideoEditorService } from "@/lib/services/video-editor-service";
import { workerUploadService } from "@/lib/services/worker-upload-service";
import { Loader } from "@/components/ui/loader";

interface RecordingCardProps {
  recording: Recording;
  onPlay: (recording: Recording) => void;
  onEdit: (recording: Recording) => void;
  onRename: (recording: Recording) => void;
  onShare: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

function RecordingCard({
  recording,
  onPlay,
  onEdit,
  onRename,
  onShare,
  onDelete,
}: RecordingCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `0:${secs.toString().padStart(2, "0")}`;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: "white",
        border: "1px solid #f1f5f9",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent sx={{ p: 0, pb: "12px !important" }}>
        {/* Thumbnail */}
        <Box
          sx={{
            position: "relative",
            aspectRatio: "16/9",
            backgroundColor: "#f8fafc",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: recording.status === "ready" ? "pointer" : "default",
            overflow: "hidden",
            width: "100%",
            height: "auto",
            "&:hover .play-overlay": {
              opacity: 1,
            },
          }}
          onClick={() => recording.status === "ready" && onPlay(recording)}
        >
          {recording.thumbnail ? (
            <img
              src={recording.thumbnail}
              alt={recording.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px 12px 0 0",
                display: "block",
                aspectRatio: "16/9",
              }}
            />
          ) : recording.status === "processing" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                position: "relative",
                zIndex: 10,
              }}
            >
              <CircularProgress size={32} color="primary" />
              <Typography
                variant="caption"
                sx={{ color: "#666", textAlign: "center" }}
              >
                Generating thumbnail...
              </Typography>
            </Box>
          ) : (
            <Video size={48} color="#a855f7" />
          )}

          {/* Play overlay - show on card hover only when ready */}
          {recording.status === "ready" && (
            <Box
              className="play-overlay"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
                cursor: "pointer",
              }}
            >
              <Play size={24} color="white" fill="white" />
            </Box>
          )}

          {/* Status badge - only show if not ready */}
          {recording.status !== "ready" && (
            <Chip
              label={recording.status}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor:
                  recording.status === "processing" ? "#f59e0b" : "#ef4444",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                zIndex: 15,
              }}
            />
          )}

          {/* Edited badge */}
          {recording.originalRecordingId && (
            <Chip
              label="Edited"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: recording.status !== "ready" ? 80 : 12,
                backgroundColor: "#8b5cf6",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}

          {/* Chips container - prevents overlap */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 1,
              zIndex: 2,
            }}
          >
            {/* Public/Private status chip */}
            <Chip
              icon={
                recording.isPublic ? <Globe size={12} /> : <Lock size={12} />
              }
              label={recording.isPublic ? "Public" : "Private"}
              size="small"
              sx={{
                backgroundColor: recording.isPublic ? "#10b981" : "#6b7280",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />

            {/* Quality chip */}
            <Chip
              icon={<Monitor size={12} />}
              label={recording.quality}
              size="small"
              sx={{
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Duration - only show if ready and has valid duration */}
          {recording.status === "ready" && recording.duration > 0 && (
            <Chip
              label={formatDuration(recording.duration)}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: "6px",
                height: "24px",
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 1.5, pt: 1, pb: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: "1rem",
                letterSpacing: "-0.025em",
              }}
            >
              {recording.title}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ ml: 1 }}
            >
              <MoreVertical size={18} />
            </IconButton>
          </Box>

          {recording.description &&
            !recording.description.startsWith("Recorded on") &&
            !recording.description.startsWith("Size:") && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {recording.description}
              </Typography>
            )}

          {/* Meta info */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={13} color="#9ca3af" />
              <Typography variant="caption" color="text.secondary">
                {formatDate(recording.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HardDrive size={13} color="#9ca3af" />
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(recording.size)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Eye size={13} color="#9ca3af" />
              <Typography variant="caption" color="text.secondary">
                {recording.views} views
              </Typography>
            </Box>
          </Box>

          {/* Tags */}
          {recording.tags && recording.tags.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {recording.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem", height: 24 }}
                />
              ))}
              {recording.tags.length > 3 && (
                <Chip
                  label={`+${recording.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem", height: 24 }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              onPlay(recording);
              setAnchorEl(null);
            }}
          >
            <Play size={16} style={{ marginRight: 8 }} />
            Play
          </MenuItem>
          <MenuItem
            onClick={() => {
              onEdit(recording);
              setAnchorEl(null);
            }}
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit Video
          </MenuItem>
          <MenuItem
            onClick={() => {
              onRename(recording);
              setAnchorEl(null);
            }}
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Rename
          </MenuItem>
          <MenuItem onClick={() => window.open(recording.videoUrl, "_blank")}>
            <Download size={16} style={{ marginRight: 8 }} />
            Download
          </MenuItem>
          <MenuItem
            onClick={() => {
              onShare(recording);
              setAnchorEl(null);
            }}
          >
            <Share size={16} style={{ marginRight: 8 }} />
            Share
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(recording);
              setAnchorEl(null);
            }}
            sx={{ color: "error.main" }}
          >
            <Trash2 size={16} style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}

function RecordingsPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [myRecordings, setMyRecordings] = useState<Recording[]>([]);
  const [sharedRecordings, setSharedRecordings] = useState<Recording[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my");
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Recording | null>(null);
  const [deletingRecordingId, setDeletingRecordingId] = useState<string | null>(
    null
  );
  const [editingRecording, setEditingRecording] = useState<Recording | null>(
    null
  );
  const [renamingRecording, setRenamingRecording] = useState<Recording | null>(
    null
  );
  const [sharingRecording, setSharingRecording] = useState<Recording | null>(
    null
  );
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(
    null
  );

  // Ref to store the polling timeout
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if a load is in progress
  const isLoadingRef = useRef(false);

  const loadRecordings = useCallback(
    async (isPollingUpdate = false) => {
      if (!user) return;

      // Prevent multiple simultaneous calls
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;

      try {
        // Only show main loading for initial load, not for polling updates
        if (!isPollingUpdate) {
          setLoading(true);
        } else {
          setIsPolling(true);
        }

        // Get real recordings from server
        const serverRecordings =
          await RecordingUploadService.getUserRecordings();

        // Get temporary recordings from IndexedDB/worker
        const tempRecordings =
          await workerUploadService.getTemporaryRecordings();

        // Filter out temporary recordings that now exist on server
        const serverRecordingTitles = new Set(
          serverRecordings.map((r: Recording) => r.title)
        );
        const validTempRecordings = tempRecordings.filter(
          (temp: Recording) => !serverRecordingTitles.has(temp.title)
        );

        // Clean up any temporary recordings that are now on server
        tempRecordings.forEach((temp: Recording) => {
          if (serverRecordingTitles.has(temp.title)) {
            workerUploadService.clearTemporaryRecording(temp.id);
          }
        });

        // Combine server recordings with valid temporary recordings
        const allRecordings = [
          ...validTempRecordings,
          ...serverRecordings,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Only update state if there are actual changes to prevent unnecessary re-renders
        setMyRecordings((prevRecordings) => {
          // Check if recordings have actually changed
          if (prevRecordings.length !== allRecordings.length) {
            return allRecordings;
          }

          // More sophisticated comparison: check if any recording has meaningful changes
          const hasChanges = allRecordings.some((newRec, index) => {
            const prevRec = prevRecordings[index];
            if (!prevRec) return true;

            // Only check fields that would cause visual changes
            const statusChanged = prevRec.status !== newRec.status;
            const thumbnailChanged = prevRec.thumbnail !== newRec.thumbnail;
            const titleChanged = prevRec.title !== newRec.title;
            const viewsChanged = prevRec.views !== newRec.views;

            // For processing recordings, only update if status or thumbnail changed
            if (newRec.status === "processing") {
              return statusChanged || thumbnailChanged;
            }

            // For ready recordings, check all relevant fields
            return (
              statusChanged || thumbnailChanged || titleChanged || viewsChanged
            );
          });

          return hasChanges ? allRecordings : prevRecordings;
        });

        // Load shared recordings only on initial load, not during polling
        // This prevents repeated API calls every 10 seconds
        if (!isPollingUpdate) {
          try {
            const authToken = await user.getIdToken();
            const response = await fetch("/api/recordings/shared", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });

            if (response.ok) {
              const responseData = await response.json();
              // Handle both direct array and object with sharedRecordings property
              const sharedRecordingsList = Array.isArray(responseData)
                ? responseData
                : responseData.sharedRecordings || [];
              setSharedRecordings(sharedRecordingsList);
            } else {
              console.warn("Failed to load shared recordings");
              setSharedRecordings([]);
            }
          } catch (sharedError) {
            console.warn("Error loading shared recordings:", sharedError);
            setSharedRecordings([]);
          }
        }

        // Check if any recordings are still processing
        const allRecordingsCombined = [
          ...allRecordings,
          ...(sharedRecordings || []),
        ];
        const hasProcessingRecordings = allRecordingsCombined.some(
          (r: Recording) => r.status === "processing"
        );

        // Clear any existing polling timeout
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
          pollingTimeoutRef.current = null;
        }

        if (hasProcessingRecordings) {
          // Poll for updates every 10 seconds if there are processing recordings (even less aggressive)
          // Add a small delay to prevent immediate re-polling
          pollingTimeoutRef.current = setTimeout(() => {
            loadRecordings(true); // Pass true to indicate this is a polling update
          }, 10000);
        }
      } catch (err) {
        console.error("🔥 RECORDINGS: Error in loadRecordings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load recordings"
        );
      } finally {
        setLoading(false);
        setIsPolling(false);
        isLoadingRef.current = false; // Reset loading state
      }
    },
    [user]
  ); // Only depend on user to avoid infinite loops

  useEffect(() => {
    if (user) {
      loadRecordings();
    }

    // Cleanup polling on unmount
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [user, loadRecordings]); // Include loadRecordings dependency



  // Handle opening video from notifications
  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam && (myRecordings.length > 0 || sharedRecordings.length > 0)) {
      // Look for the recording in both my recordings and shared recordings
      const allRecordings = [...myRecordings, ...sharedRecordings];
      const recordingToOpen = allRecordings.find((r) => r.id === openParam);

      if (recordingToOpen) {
        setPlayingRecording(recordingToOpen);
        // Clear the query parameter by replacing the URL without it
        const url = new URL(window.location.href);
        url.searchParams.delete("open");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, myRecordings, sharedRecordings]);

  const handlePlay = (recording: Recording) => {
    setPlayingRecording(recording);
  };

  const handleEdit = (recording: Recording) => {
    setEditingRecording(recording);
  };

  const handleRename = (recording: Recording) => {
    setRenamingRecording(recording);
  };

  const handleShare = (recording: Recording) => {
    setSharingRecording(recording);
  };

  const handleSaveRename = async (
    recordingId: string,
    title: string,
    description?: string
  ) => {
    try {
      setError(null);

      // Get auth token
      const authToken = await user?.getIdToken();
      if (!authToken) {
        throw new Error("Authentication required");
      }

      // Call update API
      const response = await fetch(`/api/recordings/${recordingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }

      // Close dialog and update state
      setRenamingRecording(null);

      // Update recordings in state instead of full reload
      setMyRecordings((prev) =>
        prev.map((r) =>
          r.id === recordingId ? { ...r, title, description } : r
        )
      );

      // Show success message
      setSuccess("Recording renamed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("🔥 RECORDINGS: Rename failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to rename recording"
      );
    }
  };

  const handleSaveEditedVideo = async (
    editedBlob: Blob,
    startTime: number,
    endTime: number
  ) => {
    if (!editingRecording) return;

    try {
      setLoading(true);
      setError(null);

      // Generate title for edited video
      const editedTitle = `${editingRecording.title} (Edited)`;
      const editedDescription = `Trimmed from ${startTime.toFixed(
        1
      )}s to ${endTime.toFixed(1)}s`;

      // Upload edited video
      await VideoEditorService.uploadEditedVideo({
        blob: editedBlob,
        originalRecordingId: editingRecording.id,
        startTime: startTime,
        endTime: endTime,
        title: editedTitle,
        description: editedDescription,
      });

      // Close editor and add new recording to state
      setEditingRecording(null);
      // The new recording will be picked up by the polling if still processing
      // or we can add it optimistically to the state

      // Show success message
      setSuccess("Video edited and saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Video editing failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save edited video"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recording: Recording) => {
    try {
      setDeletingRecordingId(recording.id);
      setError(null); // Clear any previous errors

      // Get auth token
      const authToken = await user?.getIdToken();
      if (!authToken) {
        throw new Error("Authentication required");
      }

      // Call delete API
      const response = await fetch(`/api/recordings/${recording.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🔥 RECORDINGS: Delete error response:", errorData);
        throw new Error(errorData.error || "Delete failed");
      }

      // Close dialog first
      setDeleteDialog(null);

      // Remove from state instead of full reload
      setMyRecordings((prev) => prev.filter((r) => r.id !== recording.id));

      // Show success message
      setSuccess("Recording deleted successfully");
      setTimeout(() => setSuccess(null), 3000); // Auto-hide after 3 seconds
    } catch (err) {
      console.error("🔥 RECORDINGS: Delete failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete recording"
      );
    } finally {
      setDeletingRecordingId(null);
    }
  };

  if (authLoading || loading) {
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
          Please log in to access your recordings.
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {success}
          </Alert>
        )}

        {isPolling && (
          <Box
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              borderRadius: "20px",
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.875rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <CircularProgress size={14} sx={{ color: "white" }} />
            Updating...
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={activeTab === "my" ? "contained" : "text"}
                onClick={() => setActiveTab("my")}
                sx={{
                  backgroundColor:
                    activeTab === "my" ? "#a855f7" : "transparent",
                  color: activeTab === "my" ? "white" : "#6b7280",
                  "&:hover": {
                    backgroundColor: activeTab === "my" ? "#9333ea" : "#f3f4f6",
                  },
                  borderRadius: "8px 8px 0 0",
                  px: 2.5,
                  py: 1,
                  fontSize: "0.9rem",
                }}
              >
                My Recordings ({myRecordings.length})
              </Button>
              <Button
                variant={activeTab === "shared" ? "contained" : "text"}
                onClick={() => setActiveTab("shared")}
                sx={{
                  backgroundColor:
                    activeTab === "shared" ? "#a855f7" : "transparent",
                  color: activeTab === "shared" ? "white" : "#6b7280",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "shared" ? "#9333ea" : "#f3f4f6",
                  },
                  borderRadius: "8px 8px 0 0",
                  px: 2.5,
                  py: 1,
                  fontSize: "0.9rem",
                }}
              >
                Shared With Me ({sharedRecordings.length})
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Content based on active tab */}
        {activeTab === "my" && myRecordings.length === 0 ? (
          // Empty State
          <Card
            elevation={0}
            sx={{
              backgroundColor: "white",
              border: "1px solid #f1f5f9",
              borderRadius: 3,
              textAlign: "center",
              py: 6,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "#f3e8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                <Video size={32} color="#a855f7" />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#1a1a1a",
                  fontSize: "1.2rem",
                }}
              >
                No recordings yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, fontSize: "0.9rem" }}
              >
                Start creating amazing content with your first recording
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Plus size={20} />}
                onClick={() => router.push("/dashboard/record")}
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
                Create First Recording
              </Button>
            </CardContent>
          </Card>
        ) : activeTab === "shared" && sharedRecordings.length === 0 ? (
          // Empty Shared State
          <Card
            elevation={0}
            sx={{
              backgroundColor: "white",
              border: "1px solid #f1f5f9",
              borderRadius: 3,
              textAlign: "center",
              py: 8,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f3e8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Share size={40} color="#a855f7" />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}
              >
                No shared recordings
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                When someone shares a recording with you, it will appear here
              </Typography>
            </CardContent>
          </Card>
        ) : (
          // Recordings Grid
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {(activeTab === "my" ? myRecordings : sharedRecordings || []).map(
              (recording) => (
                <Box key={recording.id}>
                  {recording.sharedBy && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#6b7280",
                        mb: 1,
                        display: "block",
                        fontSize: "0.75rem",
                      }}
                    >
                      Shared by {recording.sharedBy.email} on{" "}
                      {new Date(recording.sharedAt || "").toLocaleDateString()}
                    </Typography>
                  )}
                  <RecordingCard
                    recording={recording}
                    onPlay={handlePlay}
                    onEdit={handleEdit}
                    onRename={handleRename}
                    onShare={handleShare}
                    onDelete={() => setDeleteDialog(recording)}
                  />
                </Box>
              )
            )}
          </Box>
        )}

        {/* Video Player Modal */}
        <VideoPlayerModal
          open={!!playingRecording}
          onClose={() => setPlayingRecording(null)}
          recording={playingRecording}
          onRecordingUpdate={() => {
            // Refresh recordings when sharing settings are updated or view count changes
            loadRecordings();
          }}
        />

        {/* Video Editor Modal */}
        <VideoEditor
          open={!!editingRecording}
          onClose={() => setEditingRecording(null)}
          recording={editingRecording}
          onSave={handleSaveEditedVideo}
        />

        {/* Rename Recording Dialog */}
        <RenameRecordingDialog
          open={!!renamingRecording}
          onClose={() => setRenamingRecording(null)}
          recording={renamingRecording}
          onSave={handleSaveRename}
        />

        {/* Share Recording Dialog */}
        <ShareRecordingDialog
          open={!!sharingRecording}
          onClose={() => setSharingRecording(null)}
          recording={sharingRecording}
          onUpdate={() => {
            // Only update for public/private toggle (called from handlePublicToggle)
            // Email operations don't call this to avoid dialog closing/reopening
            if (sharingRecording) {
              setMyRecordings((prev) =>
                prev.map((r) =>
                  r.id === sharingRecording.id
                    ? { ...r, isPublic: !r.isPublic }
                    : r
                )
              );
              // Also update the sharingRecording state to reflect changes
              setSharingRecording((prev) =>
                prev ? { ...prev, isPublic: !prev.isPublic } : null
              );
            }
            // Refresh from server to get latest data for public/private toggle
            loadRecordings();
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          key={deleteDialog?.id || "delete-dialog"}
          open={!!deleteDialog}
          onClose={() => !deletingRecordingId && setDeleteDialog(null)}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown={!!deletingRecordingId}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Trash2 size={24} color="#ef4444" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delete Recording
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteDialog?.title}&quot;</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone. The recording and all associated
              files will be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setDeleteDialog(null)}
              disabled={!!deletingRecordingId}
              sx={{
                color: "#666",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              disabled={!!deletingRecordingId}
              color="error"
              variant="contained"
              startIcon={
                deletingRecordingId ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Trash2 size={16} />
                )
              }
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": { backgroundColor: "#dc2626" },
                "&:disabled": { backgroundColor: "#fca5a5" },
              }}
            >
              {deletingRecordingId ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default function RecordingsPage() {
  return (
    <Suspense fallback={<Loader />  }>
      <RecordingsPageContent />
    </Suspense>
  );
}
