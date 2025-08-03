"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VideoPlayerModal } from "@/components/video/video-player-modal";
import { Recording } from "@/lib/types/recording";
import { useAuth } from "@/contexts/auth-context";
import {
  CircularProgress,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { LogIn, UserPlus } from "lucide-react";

export default function PublicVideoViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const loadRecording = async () => {
      const { id } = await params;
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Try to get public recording (no auth required)
        const response = await fetch(`/api/recordings/public/${id}`);

        if (response.status === 401) {
          // Recording requires authentication
          if (!user) {
            setShowAuthDialog(true);
            return;
          }

          // Try with authentication
          const authToken = await user.getIdToken();
          const authResponse = await fetch(
            `/api/recordings/shared/${id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (!authResponse.ok) {
            if (authResponse.status === 403) {
              // User is authenticated but doesn't have permission
              // Keep showing auth dialog with permission error
              setShowAuthDialog(true);
              setError("You don't have permission to view this recording.");
            } else {
              setError("Recording not found.");
            }
            return;
          }

          const recordingData = await authResponse.json();
          setRecording(recordingData);
        } else if (response.ok) {
          const recordingData = await response.json();
          setRecording(recordingData);
        } else {
          setError("Recording not found.");
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recording"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecording();
  }, [params, user]);



  const handleClose = () => {
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error && !showAuthDialog) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

    return (
    <>
      <VideoPlayerModal
        open={!!recording}
        onClose={handleClose}
        recording={recording}
        isPublicView={true}
      />

      {/* Authentication Required Dialog */}
      <Dialog
        open={showAuthDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user && error ? "Access Denied" : "Sign in Required"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          {user && error ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You don't have permission to view this recording.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This recording is private and hasn't been shared with your
                account ({user.email}). You can try signing in with a different
                account that has access, or contact the owner to request access.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This recording is private. Please sign in to view it.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you have been given access to this recording, sign in with
                the email address that was shared with.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#666",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            {user && error ? "Close" : "Cancel"}
          </Button>
          {!user ? (
            <>
              <Button
                variant="outlined"
                onClick={handleSignUp}
                startIcon={<UserPlus size={16} />}
                sx={{
                  borderColor: "#a855f7",
                  color: "#a855f7",
                  "&:hover": {
                    borderColor: "#9333ea",
                    backgroundColor: "#f3e8ff",
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                onClick={handleLogin}
                startIcon={<LogIn size={16} />}
                sx={{
                  backgroundColor: "#a855f7",
                  "&:hover": { backgroundColor: "#9333ea" },
                }}
              >
                Sign In
              </Button>
            </>
          ) : error ? (
            // User is signed in but doesn't have access - show sign in with different account option
            <Button
              variant="outlined"
              onClick={handleLogin}
              startIcon={<LogIn size={16} />}
              sx={{
                borderColor: "#a855f7",
                color: "#a855f7",
                "&:hover": {
                  borderColor: "#9333ea",
                  backgroundColor: "#f3e8ff",
                },
              }}
            >
              Sign In with Different Account
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}
