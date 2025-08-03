"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import {
  Video,
  Play,
  Eye,
  Clock,
  TrendingUp,
  Plus,
  Sparkles,
  BarChart3,
  Activity,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { RecordingUploadService } from "@/lib/services/recording-upload";
import type { Recording } from "@/lib/types/recording";
import { UploadProgressIndicator } from "@/components/upload/upload-progress-indicator";
import { VideoPlayerModal } from "@/components/video/video-player-modal";

interface ModernStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function ModernStatCard({
  icon,
  label,
  value,
  subtitle,
  gradient,
  trend,
}: ModernStatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${gradient})`,
        borderRadius: 4,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50% 0 0 50%",
          transform: "translateX(30%)",
        },
      }}
    >
      <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {React.cloneElement(
              icon as React.ReactElement,
              {
                size: 22,
                color: "white",
              } as Record<string, unknown>
            )}
          </Box>
          {trend && (
            <Chip
              label={`${trend.isPositive ? "+" : ""}${trend.value}%`}
              size="small"
              sx={{
                backgroundColor: trend.isPositive
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(239,68,68,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 0.5,
            lineHeight: 1.1,
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.875rem",
            mb: 0.25,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.75rem",
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface RecordingItemProps {
  recording: Recording;
  onClick: () => void;
}

function RecordingItem({ recording, onClick }: RecordingItemProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${(seconds % 60)
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #f1f5f9",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#a855f7",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(168,85,247,0.15)",
          backgroundColor: "#fafbfc",
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flex: 1 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background:
              recording.status === "ready"
                ? "linear-gradient(135deg, #a855f7, #d946ef)"
                : "linear-gradient(135deg, #f59e0b, #d97706)",
            boxShadow: "0 4px 12px rgba(168,85,247,0.2)",
          }}
        >
          {recording.status === "ready" ? (
            <Play size={20} color="white" />
          ) : (
            <Clock size={20} color="white" />
          )}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: "0.9rem",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {recording.title}
            </Typography>
            <Chip
              label={recording.status === "ready" ? "Ready" : "Processing"}
              size="small"
              sx={{
                backgroundColor:
                  recording.status === "ready" ? "#ddd6fe" : "#fef3c7",
                color: recording.status === "ready" ? "#7c3aed" : "#d97706",
                fontWeight: 600,
                fontSize: "0.65rem",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "0.75rem" }}
            >
              {formatDuration(recording.duration)}
            </Typography>
            <Box
              sx={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "#d1d5db",
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "0.75rem" }}
            >
              {recording.views} views
            </Typography>
            <Box
              sx={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "#d1d5db",
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "0.75rem" }}
            >
              {getTimeAgo(recording.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <ArrowRight size={20} color="#9ca3af" />
    </Box>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);



  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await RecordingUploadService.getUserRecordings();
      setRecordings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingClick = (recording: Recording) => {
    if (recording.status === "ready") {
      setSelectedRecording(recording);
      setVideoModalOpen(true);
    } else {
      // If still processing, go to recordings page
      router.push("/dashboard/recordings");
    }
  };

  const handleCloseModal = () => {
    setVideoModalOpen(false);
    setSelectedRecording(null);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Calculate real stats from recordings
  const totalRecordings = recordings.length;
  const totalViews = recordings.reduce((sum, r) => sum + r.views, 0);
  const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0);
  const totalSize = recordings.reduce((sum, r) => sum + r.size, 0);
  const avgViews =
    totalRecordings > 0 ? Math.round(totalViews / totalRecordings) : 0;

  const stats = [
    {
      icon: <Video />,
      label: "Total Recordings",
      value: totalRecordings.toString(),
      subtitle: `${formatFileSize(totalSize)} storage`,
      gradient: "#a855f7, #d946ef",
      trend: { value: 12, isPositive: true },
    },
    {
      icon: <Eye />,
      label: "Total Views",
      value: totalViews.toLocaleString(),
      subtitle: "across all content",
      gradient: "#10b981, #059669",
      trend: { value: 8, isPositive: true },
    },
    {
      icon: <Clock />,
      label: "Content Duration",
      value: formatDuration(totalDuration),
      subtitle: "total recording time",
      gradient: "#f59e0b, #d97706",
    },
    {
      icon: <TrendingUp />,
      label: "Average Views",
      value: avgViews.toString(),
      subtitle: "per recording",
      gradient: "#ef4444, #dc2626",
      trend: { value: 15, isPositive: true },
    },
  ];

  const recentRecordings = recordings
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

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
          <CircularProgress size={48} sx={{ color: "#a855f7" }} />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          Please log in to access your dashboard.
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: "linear-gradient(135deg, #a855f7, #d946ef)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={18} color="white" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#1a1a1a",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  lineHeight: 1.1,
                }}
              >
                Welcome back,{" "}
                {user.displayName || user.email?.split("@")[0] || "Creator"}!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  mt: 0.25,
                }}
              >
                Here&apos;s what&apos;s happening with your recordings today
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {stats.map((stat, index) => (
            <ModernStatCard key={index} {...stat} />
          ))}
        </Box>

        {/* Quick Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              background: "white",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#a855f7",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(168,85,247,0.15)",
              },
            }}
            onClick={() => router.push("/dashboard/record")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #a855f715, #a855f708)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <Video size={22} color="#a855f7" />
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}
              >
                New Recording
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.8rem" }}
              >
                Start a new screen recording
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              background: "white",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#10b981",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(16,185,129,0.15)",
              },
            }}
            onClick={() => router.push("/dashboard/analytics")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #10b98115, #10b98108)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <BarChart3 size={22} color="#10b981" />
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}
              >
                Analytics
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.8rem" }}
              >
                View performance insights
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              background: "white",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#f59e0b",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(245,158,11,0.15)",
              },
            }}
            onClick={() => router.push("/dashboard/recordings")}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f59e0b15, #f59e0b08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <Activity size={22} color="#f59e0b" />
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}
              >
                My Library
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.8rem" }}
              >
                Manage all recordings
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Recordings */}
        <Card
          elevation={0}
          sx={{
            background: "white",
            borderRadius: 4,
            border: "1px solid #f1f5f9",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#1a1a1a",
                    mb: 0.25,
                    fontSize: "1.1rem",
                  }}
                >
                  Recent Recordings
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.8rem" }}
                >
                  Your latest content at a glance
                </Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                onClick={() => router.push("/dashboard/recordings")}
                sx={{
                  borderColor: "#e5e7eb",
                  color: "#6b7280",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#a855f7",
                    color: "#a855f7",
                    backgroundColor: "#a855f708",
                  },
                }}
              >
                View All
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {recentRecordings.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  color: "text.secondary",
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Plus size={40} color="#9ca3af" />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 0.5, fontWeight: 600, fontSize: "1.1rem" }}
                >
                  No recordings yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "#64748b", fontSize: "0.85rem" }}
                >
                  Create your first recording to get started with SmartRec
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Video size={18} />}
                  onClick={() => router.push("/dashboard/record")}
                  sx={{
                    background: "linear-gradient(135deg, #a855f7, #d946ef)",
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      background: "linear-gradient(135deg, #9333ea, #c026d3)",
                    },
                  }}
                >
                  Start Recording
                </Button>
              </Box>
            ) : (
              <Stack spacing={3}>
                {recentRecordings.map((recording) => (
                  <RecordingItem
                    key={recording.id}
                    recording={recording}
                    onClick={() => handleRecordingClick(recording)}
                  />
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Upload Progress Indicator */}
        <UploadProgressIndicator />

        {/* Video Player Modal */}
        <VideoPlayerModal
          open={videoModalOpen}
          onClose={handleCloseModal}
          recording={selectedRecording}
          onRecordingUpdate={loadDashboardData}
        />
      </Box>
    </DashboardLayout>
  );
}
