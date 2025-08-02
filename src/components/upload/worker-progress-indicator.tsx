"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import { Upload, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import {
  workerUploadService,
  type UploadTask,
  type MemoryInfo,
} from "@/lib/services/worker-upload-service";

export function WorkerProgressIndicator() {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

  useEffect(() => {
    const unsubscribe = workerUploadService.subscribe(
      (newTasks, newMemoryInfo) => {
        setTasks(newTasks);
        setMemoryInfo(newMemoryInfo);
      }
    );

    return unsubscribe;
  }, []);

  // Don't render if no active tasks
  const activeTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "uploading"
  );

  if (activeTasks.length === 0) {
    return null;
  }

  const getStatusIcon = (status: UploadTask["status"]) => {
    switch (status) {
      case "pending":
        return <Loader size={16} className="animate-spin" />;
      case "uploading":
        return <Upload size={16} />;
      case "completed":
        return <CheckCircle size={16} color="#10b981" />;
      case "failed":
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: UploadTask["status"]) => {
    switch (status) {
      case "pending":
        return "#6b7280";
      case "uploading":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: UploadTask["status"]) => {
    switch (status) {
      case "pending":
        return "Queued";
      case "uploading":
        return "Uploading";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        maxWidth: 400,
      }}
    >
      {/* Memory usage warning */}
      {memoryInfo && memoryInfo.current > memoryInfo.limit * 0.8 && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          onClose={() => workerUploadService.cleanupStaleTasks()}
        >
          High memory usage: {memoryInfo.usage}
        </Alert>
      )}

      {/* Upload tasks */}
      {activeTasks.map((task) => (
        <Card
          key={task.id}
          elevation={8}
          sx={{
            mb: 2,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 2, pb: "16px !important" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ mt: 0.5 }}>{getStatusIcon(task.status)}</Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {task.title}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Chip
                    label={getStatusText(task.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(task.status),
                      color: "white",
                      fontSize: "0.75rem",
                      height: 20,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {(task.blobSize / (1024 * 1024)).toFixed(1)}MB
                  </Typography>
                </Box>

                {task.status === "uploading" && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Uploading...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "#f3f4f6",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#3b82f6",
                        },
                      }}
                    />
                  </Box>
                )}

                {task.status === "failed" && task.error && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {task.error}
                  </Typography>
                )}
              </Box>

              <IconButton
                size="small"
                onClick={() => workerUploadService.clearTask(task.id)}
                sx={{ mt: -0.5 }}
              >
                <X size={16} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Memory info */}
      {memoryInfo && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            px: 1,
            py: 0.5,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 1,
          }}
        >
          Worker Memory: {memoryInfo.usage}
        </Typography>
      )}
    </Box>
  );
}
