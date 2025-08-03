"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import type { ChatMessage } from "@/lib/types/chat";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

interface MessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayName =
    message.userDisplayName || message.userEmail.split("@")[0];

  // Use a simple timestamp on server, formatted time on client
  const timeAgo = isMounted
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : new Date(message.createdAt).toLocaleTimeString();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isOwnMessage ? "row-reverse" : "row",
        mb: 1,
        px: 2,
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      {/* Simple Avatar */}
      {!isOwnMessage && (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      )}

      {/* Message Container */}
      <Box
        sx={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: isOwnMessage ? "flex-end" : "flex-start",
        }}
      >
        {/* Name and Time (only for others' messages) */}
        {!isOwnMessage && (
          <Typography
            variant="caption"
            sx={{
              color: "#6c757d",
              fontSize: "0.7rem",
              fontWeight: 600,
              mb: 0.25,
              px: 1,
            }}
          >
            {displayName} • {timeAgo}
          </Typography>
        )}

        {/* Simple Message Bubble */}
        <Box
          sx={{
            backgroundColor: isOwnMessage ? "#667eea" : "white",
            color: isOwnMessage ? "white" : "#374151",
            borderRadius: isOwnMessage
              ? "16px 16px 4px 16px"
              : "16px 16px 16px 4px",
            px: 2,
            py: 1.5,
            border: isOwnMessage ? "none" : "1px solid #e5e7eb",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.4,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {message.message}
          </Typography>
        </Box>

        {/* Time for own messages */}
        {isOwnMessage && (
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontSize: "0.7rem",
              mt: 0.25,
              px: 1,
            }}
          >
            {timeAgo}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function ChatMessageList({
  messages,
  currentUserId,
  isLoading = false,
  emptyMessage = "No messages yet. Start the conversation!",
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress size={32} sx={{ color: "#7c3aed" }} />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          color: "#666",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {emptyMessage}
        </Typography>
        <Chip
          label="Real-time chat"
          size="small"
          variant="outlined"
          sx={{
            borderColor: "#7c3aed",
            color: "#7c3aed",
            fontSize: "0.7rem",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 0,
        py: 1.5,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
        backgroundColor: "#f9fafb",
        "&::-webkit-scrollbar": {
          width: "3px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#d1d5db",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#9ca3af",
        },
      }}
    >
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwnMessage={message.userId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}
