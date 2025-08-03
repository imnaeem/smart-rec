"use client";

import React from "react";
import { Box, Typography, Avatar, Chip, Stack, Tooltip } from "@mui/material";
import { Circle } from "lucide-react";
import type { ChatPresence } from "@/lib/types/chat";

interface ChatOnlineUsersProps {
  onlineUsers: ChatPresence[];
  currentUserId?: string;
}

export function ChatOnlineUsers({
  onlineUsers,
  currentUserId,
}: ChatOnlineUsersProps) {
  const otherUsers = onlineUsers.filter(
    (user) => user.userId !== currentUserId
  );
  const currentUser = onlineUsers.find((user) => user.userId === currentUserId);

  const getUserDisplayName = (user: ChatPresence) => {
    return user.userDisplayName || user.userEmail.split("@")[0];
  };

  if (onlineUsers.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 3,
        py: 1.5,
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "white",
        flexShrink: 0,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ minHeight: 32 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Circle size={6} fill="#10b981" stroke="#10b981" />
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontSize: "0.7rem",
              fontWeight: 500,
            }}
          >
            {onlineUsers.length} online
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.75}>
          {/* Show current user first */}
          {currentUser && (
            <Tooltip title={`${getUserDisplayName(currentUser)} (You)`}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.65rem",
                  backgroundColor: "#667eea",
                  fontWeight: 600,
                }}
              >
                {getUserDisplayName(currentUser).charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          )}

          {/* Show other users */}
          {otherUsers.slice(0, 4).map((user) => (
            <Tooltip key={user.userId} title={getUserDisplayName(user)}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.65rem",
                  backgroundColor: "#10b981",
                  fontWeight: 600,
                }}
              >
                {getUserDisplayName(user).charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}

          {/* Show count if more than 4 other users */}
          {otherUsers.length > 4 && (
            <Chip
              label={`+${otherUsers.length - 4}`}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.65rem",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                fontWeight: 500,
              }}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
