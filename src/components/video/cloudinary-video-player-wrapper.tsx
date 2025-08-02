"use client";

import dynamic from "next/dynamic";
import { Box, CircularProgress, Typography } from "@mui/material";
import { CloudinaryVideoPlayerProps } from "./cloudinary-video-player";

// Dynamically import the Cloudinary Video Player with no SSR
const CloudinaryVideoPlayerComponent = dynamic(
  () =>
    import("./cloudinary-video-player").then((mod) => ({
      default: mod.CloudinaryVideoPlayer,
    })),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          borderRadius: 1,
        }}
      >
        <CircularProgress size={48} sx={{ color: "#a855f7", mb: 2 }} />
        <Typography variant="body2" sx={{ color: "white" }}>
          Loading video player...
        </Typography>
      </Box>
    ),
  }
);

export function CloudinaryVideoPlayer(props: CloudinaryVideoPlayerProps) {
  return <CloudinaryVideoPlayerComponent {...props} />;
}
