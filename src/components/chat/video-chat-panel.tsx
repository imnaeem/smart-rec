"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { useVideoChat } from "@/hooks/useVideoChat";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { useAuth } from "@/contexts/auth-context";
import type { Recording } from "@/lib/types/recording";

interface VideoChatPanelProps {
  recording: Recording;
  isPublicView?: boolean;
  className?: string;
}

export function VideoChatPanel({
  recording,
  isPublicView = false,
  className = "",
}: VideoChatPanelProps) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { messages, isLoading, error, sendMessage, messageCount } =
    useVideoChat({
      recordingId: recording.id,
      recordingTitle: recording.title,
      isEnabled: !!user && !isPublicView && isMounted, // Only enable for authenticated users on private views
    });

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
        className={className}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Loading chat...
        </Typography>
      </Paper>
    );
  }

  // Disable chat completely for public videos
  if (isPublicView) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
        className={className}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Chat is disabled for public videos
        </Typography>
      </Paper>
    );
  }

  if (!user) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
        className={className}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Sign in to join the conversation
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "white",
      }}
      className={className}
    >
      {/* Simple Chat Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
              fontSize: "0.95rem",
            }}
          >
            Live Chat
          </Typography>
          {messageCount > 0 && (
            <Box
              sx={{
                backgroundColor: "#667eea",
                color: "white",
                borderRadius: "10px",
                px: 1.25,
                py: 0.25,
                fontSize: "0.7rem",
                fontWeight: 600,
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {messageCount}
            </Box>
          )}
        </Box>
      </Box>

      {/* Chat Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Error Display */}
        {error && (
          <Box sx={{ p: 1.5 }}>
            <Alert severity="error" size="small">
              {error}
            </Alert>
          </Box>
        )}

        {/* Messages List - Full Height */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <ChatMessageList
            messages={messages}
            currentUserId={user?.uid}
            isLoading={isLoading}
            emptyMessage="Start chatting about this video!"
          />
        </Box>

        {/* Message Input - Sticky Bottom */}
        <Box
          sx={{
            flexShrink: 0,
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <ChatInput
            onSendMessage={sendMessage}
            disabled={isLoading || !!error}
            placeholder="Share your thoughts..."
          />
        </Box>
      </Box>
    </Box>
  );
}
