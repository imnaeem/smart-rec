"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { VideoPlayerModal } from "@/components/video/video-player-modal";
import { RecordingUploadService } from "@/lib/services/recording-upload";
import { Recording } from "@/lib/types/recording";
import { useAuth } from "@/contexts/auth-context";
import { CircularProgress, Alert, Box } from "@mui/material";

export default function VideoViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecording = async () => {
      const { id } = await params;
      if (!id || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Get recording details
        const recordings = await RecordingUploadService.getUserRecordings();
        const foundRecording = recordings.find(
          (r: Recording) => r.id === id
        );

        if (!foundRecording) {
          setError("Recording not found or you don't have access to it.");
          return;
        }

        setRecording(foundRecording);
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
    router.push("/dashboard/recordings");
  };

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

  if (error) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <VideoPlayerModal
        open={!!recording}
        onClose={handleClose}
        recording={recording}
      />
    </DashboardLayout>
  );
}
