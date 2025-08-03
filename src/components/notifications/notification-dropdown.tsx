"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, X, Check } from "lucide-react";
import type { Notification } from "@/lib/types/notification";

interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick(notification);
  };

  const getAvatarColor = (senderId: string) => {
    const colors = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
    const index = senderId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Paper
      elevation={12}
      sx={{
        position: "absolute",
        top: "100%",
        right: 0,
        mt: 1,
        width: 400,
        maxHeight: 480,
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        zIndex: 1000,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827" }}
          >
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Box
              sx={{
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                borderRadius: "12px",
                px: 1.5,
                py: 0.25,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {notifications.length}
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={onMarkAllAsRead}
              sx={{
                fontSize: "0.75rem",
                color: "#a855f7",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 0.5,
                "&:hover": {
                  backgroundColor: "#f3e8ff",
                  color: "#9333ea",
                },
              }}
            >
              Mark all read
            </Button>
          )}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              "&:hover": { backgroundColor: "#f3f4f6" },
              borderRadius: "8px",
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Notifications List */}
      <Box
        sx={{
          maxHeight: 360,
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <MessageCircle size={28} style={{ opacity: 0.6 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 1, color: "#374151" }}
            >
              No new notifications
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              You&apos;ll see chat messages from your videos here
            </Typography>
          </Box>
        ) : (
          <List
            sx={{
              p: 0,
              width: "100%",
              overflowX: "hidden",
            }}
          >
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  component="button"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "#fefbff",
                    borderLeft: notification.isRead
                      ? "none"
                      : "3px solid #a855f7",
                    borderRadius: notification.isRead ? 0 : "0 8px 8px 0",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: notification.isRead
                        ? "#f9fafb"
                        : "#f3e8ff",
                      transform: "translateX(1px)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      color="primary"
                      invisible={notification.isRead}
                      sx={{
                        "& .MuiBadge-dot": {
                          width: 8,
                          height: 8,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: getAvatarColor(
                            notification.senderId
                          ),
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {notification.senderName?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{
                      mr: 1,
                      overflow: "hidden",
                      minWidth: 0,
                      flex: 1,
                      width: "100%",
                    }}
                    primary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.isRead ? 600 : 700,
                            color: "#111827",
                            mb: 0.25,
                            fontSize: "0.8rem",
                          }}
                        >
                          {notification.senderName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6b7280",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            mb: 0.5,
                            display: "block",
                          }}
                        >
                          {notification.recordingTitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: notification.isRead ? "#6b7280" : "#374151",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            fontSize: "0.75rem",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "240px",
                            whiteSpace: "normal",
                          }}
                        >
                          &ldquo;{notification.message}&rdquo;
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.65rem",
                          mt: 0.5,
                          display: "block",
                          fontWeight: 500,
                        }}
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    }
                  />

                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      sx={{
                        color: "#a855f7",
                        "&:hover": {
                          backgroundColor: "#f3e8ff",
                          color: "#9333ea",
                        },
                        borderRadius: "8px",
                      }}
                    >
                      <Check size={16} />
                    </IconButton>
                  )}
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      {notifications.length > 0 && (
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid #f1f5f9",
            backgroundColor: "#fafbfc",
            textAlign: "center",
            borderRadius: "0 0 12px 12px",
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            Showing {notifications.length} recent notification
            {notifications.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
