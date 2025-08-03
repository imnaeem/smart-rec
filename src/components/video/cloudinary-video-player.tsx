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
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<VideoPlayer | null>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const elementIdRef = useRef(
    `cloudinary-player-${Math.random().toString(36).substr(2, 9)}`
  );
  const isInitializingRef = useRef(false);
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (typeof window === "undefined") return;

        // Don't re-initialize if player already exists or is being initialized
        if (playerRef.current || isInitializingRef.current) {
          return;
        }

        isInitializingRef.current = true;

        // Wait for the DOM element to be available
        const elementId = elementIdRef.current;
        const element =
          videoElementRef.current || document.getElementById(elementId);
        if (!element) {
          console.warn("Video element not found, waiting...");
          isInitializingRef.current = false;
          return;
        }

        // Clear any existing cloudinary player on this element
        try {
          const existingPlayer = (
            window as Record<string, any>
          ).cloudinary?.videoPlayer?.(elementId);
          if (existingPlayer && typeof existingPlayer.dispose === "function") {
            existingPlayer.dispose();
          }
        } catch {
          // Ignore cleanup errors
        }

        const [cloudinaryModule] = await Promise.all([
          import("cloudinary-video-player"),
        ]);

        if (!publicId) {
          setError("Failed to load video");
          isInitializingRef.current = false;
          return;
        }

        const cloudinary = cloudinaryModule.default;

        // Double-check element still exists before initializing
        const finalElement = document.getElementById(elementId);
        if (!finalElement) {
          console.error("Element disappeared before initialization");
          isInitializingRef.current = false;
          return;
        }

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
        player.loop(false); // Don't loop by default

        playerRef.current = player;
        setIsPlayerReady(true);
        setError(null);
        isInitializingRef.current = false;
      } catch (error) {
        console.error("Error initializing player:", error);
        setError("Failed to initialize video player");
        isInitializingRef.current = false;
      }
    };

    let retryCount = 0;
    const maxRetries = 20; // Maximum 1 second of retries (20 * 50ms)
    let retryTimer: NodeJS.Timeout | null = null;

    // Check for element availability with retries
    const checkAndInitialize = () => {
      const elementId = elementIdRef.current;
      const element =
        videoElementRef.current || document.getElementById(elementId);
      if (element && publicId) {
        initializePlayer().catch((error) => {
          console.error("Failed to initialize player:", error);
          setError("Failed to load video player");
        });
      } else if (retryCount < maxRetries) {
        retryCount++;
        // Retry after a short delay if element isn't ready
        retryTimer = setTimeout(checkAndInitialize, 50);
      } else {
        console.error("Max retries reached, could not find video element");
        setError("Failed to initialize video player - element not found");
        isInitializingRef.current = false;
      }
    };

    // Start checking after a brief initial delay
    const timer = setTimeout(checkAndInitialize, 10);

    return () => {
      clearTimeout(timer);
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
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
      setIsPlayerReady(false);
      isInitializingRef.current = false;
    };
  }, [publicId]); // Only re-run when publicId changes

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Ensure video fits properly
        "& .video-js": {
          width: "100% !important",
          height: "100% !important",
        },
        "& .vjs-tech": {
          width: "100% !important",
          height: "100% !important",
          objectFit: "fill !important",
        },
        // FIX: Move control bar INSIDE video container with hover behavior
        "& .vjs-control-bar": {
          position: "absolute !important",
          bottom: "0px !important",
          left: "0 !important",
          right: "0 !important",
          opacity: "0.9 !important",
          transition: "opacity 0.3s ease !important",
          background:
            "linear-gradient(transparent, rgba(0,0,0,0.7)) !important",
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
      {/* Video element - always rendered to prevent DOM manipulation issues */}
      <video
        ref={videoElementRef}
        id={elementIdRef.current}
        className="cld-video-player cld-fluid vjs-default-skin"
        tabIndex={0}
      />
    </Box>
  );
}
