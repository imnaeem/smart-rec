"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { X, Copy, Mail, Share2, Globe, Lock } from "lucide-react";
import { ShareService } from "@/lib/services/share-service-client";
import { useAuth } from "@/contexts/auth-context";
import type { Recording } from "@/lib/types/recording";

interface ShareRecordingDialogProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
  onUpdate?: () => void;
}

export default function ShareRecordingDialog({
  open,
  onClose,
  recording,
  onUpdate,
}: ShareRecordingDialogProps) {
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [sharedEmails, setSharedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadShareData = async () => {
      if (recording) {
        setIsPublic(recording.isPublic || false);
        const url = ShareService.generateShareUrl(recording);

        setShareUrl(url);

        try {
          const shares = await ShareService.getSharesForRecording(recording.id);
          setSharedEmails(shares);
        } catch (loadError) {
          console.error("🔗 SHARE DIALOG: Failed to load shares:", loadError);
          setSharedEmails([]);
        }
      }
    };

    loadShareData();
  }, [recording]);

  const handlePublicToggle = async () => {
    if (!user || !recording) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const newPublicStatus = !isPublic;

      const result = await ShareService.updateRecordingPublicStatus(
        recording.id,
        newPublicStatus,
        user.uid,
        user.email || "",
        user.displayName || "",
        recording.title || "Untitled Recording"
      );

      // Update local state immediately
      setIsPublic(newPublicStatus);

      // Update the recording object to reflect the new state
      const updatedRecording = {
        ...recording,
        isPublic: newPublicStatus,
        shareToken: result.shareToken,
      };

      setShareUrl(ShareService.generateShareUrl(updatedRecording));

      setSuccess(
        newPublicStatus
          ? "Recording is now public and can be viewed by anyone with the link"
          : "Recording is now private"
      );

      // Call onUpdate immediately to update parent state
      onUpdate?.();
    } catch (err) {
      console.error("🔗 SHARE DIALOG: Error updating sharing settings:", err);
      setError("Failed to update sharing settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    if (!email.trim() || !user || !recording) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email is already shared
    if (sharedEmails.includes(email.trim().toLowerCase())) {
      setError("This email already has access to the recording");
      return;
    }

    setEmailLoading(true);
    setError("");
    setSuccess("");

    try {
      await ShareService.shareWithEmail(
        recording.id,
        email.trim().toLowerCase(),
        user.uid,
        user.email || "",
        user.displayName || "",
        recording.title || "Untitled Recording"
      );

      // Update local state immediately without closing dialog
      try {
        const updatedShares = await ShareService.getSharesForRecording(
          recording.id
        );
        setSharedEmails(updatedShares);
      } catch (refreshError) {
        console.error(
          "🔗 SHARE DIALOG: Failed to refresh shares:",
          refreshError
        );
      }
      setEmail("");
      setSuccess(`Recording shared with ${email.trim()}`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      // Don't call onUpdate for email operations to avoid dialog closing
      // onUpdate?.(); // Keep commented to prevent modal closing
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to share recording";
      setError(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    if (!user || !recording) return;

    setRemovingEmail(emailToRemove);
    setError("");

    try {
      await ShareService.removeShare(recording.id, emailToRemove);
      // Update local state immediately without closing dialog
      try {
        const updatedShares = await ShareService.getSharesForRecording(
          recording.id
        );
        setSharedEmails(updatedShares);
      } catch (refreshError) {
        console.error(
          "🔗 SHARE DIALOG: Failed to refresh shares:",
          refreshError
        );
      }
      setSuccess(`Removed access for ${emailToRemove}`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      // Don't call onUpdate for email operations to avoid dialog closing
    } catch (removeError) {
      console.error("🔗 SHARE DIALOG: Failed to remove access:", removeError);
      setError("Failed to remove access");
    } finally {
      setRemovingEmail(null);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error("🔗 SHARE DIALOG: Failed to copy URL:", copyError);
      setError("Failed to copy URL");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEmail();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Share2 size={20} />
            <Typography variant="h6">Share Recording</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Public/Private Toggle */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={handlePublicToggle}
                disabled={loading}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isPublic ? <Globe size={16} /> : <Lock size={16} />}
                <Typography>
                  {isPublic ? "Public" : "Private"} -{" "}
                  {isPublic
                    ? "Anyone with the link can view"
                    : "Only you can view"}
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Share URL */}
        {isPublic && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Share Link
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={shareUrl}
                InputProps={{ readOnly: true }}
                sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
              />
              <Button
                variant="outlined"
                onClick={handleCopyUrl}
                disabled={loading}
                startIcon={copied ? <Mail size={16} /> : <Copy size={16} />}
                sx={{ minWidth: "auto", px: 2 }}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Email Sharing */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Share with specific people
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Add email addresses to give specific people access to this
            recording.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter email address (e.g., user@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={emailLoading}
              error={
                !!(
                  email.trim() &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                )
              }
              helperText={
                email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                  ? "Please enter a valid email address"
                  : ""
              }
            />
            <Button
              variant="contained"
              onClick={handleAddEmail}
              disabled={
                !email.trim() ||
                emailLoading ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
              }
              startIcon={
                emailLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Mail size={16} />
                )
              }
              sx={{ minWidth: "auto", px: 2 }}
            >
              {emailLoading ? "Adding..." : "Share"}
            </Button>
          </Box>

          {/* Shared Emails List */}
          {sharedEmails.length > 0 && (
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}
              >
                People with access ({sharedEmails.length}):
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {sharedEmails.map((sharedEmail) => (
                  <Box
                    key={sharedEmail}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      backgroundColor: "#f8fafc",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "#a855f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {sharedEmail.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {sharedEmail}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Can view this recording
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveEmail(sharedEmail)}
                      disabled={removingEmail === sharedEmail}
                      startIcon={
                        removingEmail === sharedEmail ? (
                          <CircularProgress size={16} />
                        ) : undefined
                      }
                      sx={{ minWidth: "auto" }}
                    >
                      {removingEmail === sharedEmail ? "Removing..." : "Remove"}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {sharedEmails.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 3,
                color: "text.secondary",
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                border: "1px dashed #e2e8f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Mail size={24} style={{ opacity: 0.5 }} />
              <Typography variant="body2">
                No one has access yet. Add email addresses above.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
