"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Collapse,
  Chip,
  Stack,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  backgroundUploadService,
  type UploadTask,
} from "@/lib/services/background-upload";

export function UploadProgressIndicator() {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = backgroundUploadService.subscribe(setTasks);
    return unsubscribe;
  }, []);

  const activeTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "uploading"
  );
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const failedTasks = tasks.filter((task) => task.status === "failed");

  if (tasks.length === 0) {
    return null;
  }

  const getStatusIcon = (status: UploadTask["status"]) => {
    switch (status) {
      case "pending":
      case "uploading":
        return <CloudUpload size={16} color="#a855f7" />;
      case "completed":
        return <CheckCircle size={16} color="#10b981" />;
      case "failed":
        return <AlertCircle size={16} color="#ef4444" />;
    }
  };

  const getStatusColor = (status: UploadTask["status"]) => {
    switch (status) {
      case "pending":
      case "uploading":
        return "#a855f7";
      case "completed":
        return "#10b981";
      case "failed":
        return "#ef4444";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: 400,
        minWidth: 300,
      }}
    >
      <Card
        elevation={8}
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          border: "1px solid #f1f5f9",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CloudUpload size={20} color="#a855f7" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Upload Progress
              </Typography>
              {activeTasks.length > 0 && (
                <Chip
                  label={`${activeTasks.length} active`}
                  size="small"
                  sx={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setCollapsed(!collapsed)}
                sx={{ color: "#6b7280" }}
              >
                {collapsed ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Summary chips */}
          {!collapsed && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {completedTasks.length > 0 && (
                <Chip
                  icon={<CheckCircle size={12} />}
                  label={`${completedTasks.length} completed`}
                  size="small"
                  variant="outlined"
                  sx={{ color: "#10b981", borderColor: "#10b981" }}
                />
              )}
              {failedTasks.length > 0 && (
                <Chip
                  icon={<AlertCircle size={12} />}
                  label={`${failedTasks.length} failed`}
                  size="small"
                  variant="outlined"
                  sx={{ color: "#ef4444", borderColor: "#ef4444" }}
                />
              )}
            </Stack>
          )}

          {/* Task list */}
          <Collapse in={!collapsed}>
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              {tasks.map((task, index) => (
                <Box
                  key={task.id}
                  sx={{
                    py: 2,
                    borderBottom:
                      index < tasks.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getStatusIcon(task.status)}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#1a1a1a",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Box>
                    {(task.status === "completed" ||
                      task.status === "failed") && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          backgroundUploadService.clearTask(task.id)
                        }
                        sx={{ color: "#6b7280" }}
                      >
                        <X size={14} />
                      </IconButton>
                    )}
                  </Box>

                  {task.status === "uploading" && (
                    <Box sx={{ mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#a855f7",
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {task.progress}% uploaded
                      </Typography>
                    </Box>
                  )}

                  {task.status === "failed" && task.error && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#ef4444", display: "block" }}
                    >
                      {task.error}
                    </Typography>
                  )}

                  {task.status === "completed" && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#10b981", display: "block" }}
                    >
                      Upload completed successfully
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}
