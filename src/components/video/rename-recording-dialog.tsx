"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Edit, Save, X } from "lucide-react";
import type { Recording } from "@/lib/types/recording";

interface RenameRecordingDialogProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
  onSave: (
    recordingId: string,
    title: string,
    description?: string
  ) => Promise<void>;
}

export function RenameRecordingDialog({
  open,
  onClose,
  recording,
  onSave,
}: RenameRecordingDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when recording changes
  useEffect(() => {
    if (recording) {
      setTitle(recording.title);
      setDescription(recording.description || "");
    }
  }, [recording]);

  const handleSave = async () => {
    if (!recording || !title.trim()) return;

    try {
      setIsSaving(true);
      await onSave(recording.id, title.trim(), description.trim() || undefined);
      onClose();
    } catch (error) {
      console.error("Failed to rename recording:", error);
      // Error handling is done by parent component
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!recording) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Edit size={24} color="#a855f7" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Rename Recording
            </Typography>
          </Box>
          <Button
            onClick={handleClose}
            disabled={isSaving}
            size="small"
            sx={{ minWidth: "auto", p: 1 }}
          >
            <X size={20} />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Recording Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your recording"
            required
            disabled={isSaving}
            autoFocus
            error={!title.trim()}
            helperText={!title.trim() ? "Title is required" : ""}
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            multiline
            rows={3}
            disabled={isSaving}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isSaving}
          sx={{
            color: "#666",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!title.trim() || isSaving}
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
            "&:disabled": { backgroundColor: "#d1d5db" },
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
