"use client";

import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";

interface NativeVideoPlayerProps {
  videoUrl: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  controls?: boolean;
  onTimeUpdate?: () => void;
  onDuration?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function NativeVideoPlayer({
  videoUrl,
  width,
  height,
  autoPlay = false,
  controls = true,
  onTimeUpdate,
  onDuration,
  onPlay,
  onPause,
  onEnded,
}: NativeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners
    if (onTimeUpdate) video.addEventListener("timeupdate", onTimeUpdate);
    if (onDuration) video.addEventListener("durationchange", onDuration);
    if (onPlay) video.addEventListener("play", onPlay);
    if (onPause) video.addEventListener("pause", onPause);
    if (onEnded) video.addEventListener("ended", onEnded);

    return () => {
      // Cleanup event listeners
      if (onTimeUpdate) video.removeEventListener("timeupdate", onTimeUpdate);
      if (onDuration) video.removeEventListener("durationchange", onDuration);
      if (onPlay) video.removeEventListener("play", onPlay);
      if (onPause) video.removeEventListener("pause", onPause);
      if (onEnded) video.removeEventListener("ended", onEnded);
    };
  }, [onTimeUpdate, onDuration, onPlay, onPause, onEnded]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        controls={controls}
        autoPlay={autoPlay}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // This ensures proper aspect ratio
          display: "block",
        }}
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}
