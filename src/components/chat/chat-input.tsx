"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled || isSending}
        ref={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSend}
                disabled={!message.trim() || isSending || disabled}
                size="small"
                sx={{
                  color:
                    message.trim() && !isSending && !disabled
                      ? "#667eea"
                      : "#d1d5db",
                  "&:hover": {
                    backgroundColor:
                      message.trim() && !isSending && !disabled
                        ? "rgba(102, 126, 234, 0.1)"
                        : "transparent",
                  },
                  "&:disabled": {
                    color: "#d1d5db",
                  },
                }}
              >
                {isSending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Send size={18} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f9fafb",
            fontSize: "0.875rem",
            border: "1px solid #e5e7eb",
            transition: "all 0.2s ease",
            "& fieldset": {
              border: "none",
            },
            "&:hover": {
              backgroundColor: "white",
              borderColor: "#667eea",
            },
            "&.Mui-focused": {
              backgroundColor: "white",
              borderColor: "#667eea",
              boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.1)",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px 12px",
            fontWeight: 400,
          },
        }}
      />
    </Box>
  );
}
