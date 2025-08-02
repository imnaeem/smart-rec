"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import "cloudinary-video-player/cld-video-player.min.css";
import { VideoPlayer } from "cloudinary-video-player";

// Use the actual VideoPlayer type from Cloudinary

export interface CloudinaryVideoPlayerProps {
  publicId?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  controls?: boolean;
  showFallbackControls?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onDuration?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const elementId = "cloudinary-player";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function CloudinaryVideoPlayer({
  publicId,
  width = 640, // eslint-disable-line @typescript-eslint/no-unused-vars
  height = 360, // eslint-disable-line @typescript-eslint/no-unused-vars
  autoPlay = false,
  controls = true,
  onTimeUpdate,
  onDuration,
  onPlay,
  onPause,
  onEnded,
}: CloudinaryVideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<VideoPlayer | null>(null);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (typeof window === "undefined") return;

        const [cloudinaryModule] = await Promise.all([
          import("cloudinary-video-player"),
        ]);
        if (!publicId) {
          setError("Failed to load video");
          return;
        }

        const cloudinary = cloudinaryModule.default;

        const player = cloudinary.videoPlayer(elementId, {
          cloudName,
          publicId,
          controls: true,
          fluid: true,
          transformation: {
            quality: "auto",
            fetch_format: "auto",
          },
        });

        player.controls(true);
        player.loop(true);

        playerRef.current = player;
      } catch (error) {
        console.error("Error initializing player:", error);
        setError("Failed to initialize video player");
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializePlayer().catch((error) => {
        console.error("Failed to initialize player:", error);
        setError("Failed to load video player");
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (
        playerRef.current &&
        typeof playerRef.current.dispose === "function"
      ) {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (e) {
          console.warn("Error disposing player:", e);
        }
      }
    };
  }, [
    publicId,
    autoPlay,
    controls,
    onTimeUpdate,
    onDuration,
    onPlay,
    onPause,
    onEnded,
  ]);

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          minHeight: "200px",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: 1,
        overflow: "hidden",
        // FIX: Move control bar INSIDE video container with hover behavior
        "& .vjs-control-bar": {
          position: "absolute !important",
          bottom: "75px !important",
          opacity: "0 !important",
          transition: "opacity 0.3s ease !important",
        },
        "&:hover .vjs-control-bar": {
          opacity: "1 !important",
        },
        // FIX: Fullscreen controls - no margin needed
        "& .video-js.vjs-fullscreen .vjs-control-bar": {
          bottom: "0 !important",
        },
        // HIDE Cloudinary logo
        "& a.vjs-control.vjs-cloudinary-button.vjs-button": {
          display: "none !important",
        },
      }}
    >
      <video
        id={elementId}
        className="cld-video-player cld-fluid vjs-default-skin"
        tabIndex={0}
      />
    </Box>
  );
}
