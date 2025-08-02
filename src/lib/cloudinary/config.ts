import { Cloudinary } from "@cloudinary/url-gen";

// Cloudinary configuration
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  },
  url: {
    secure: true,
  },
});

// Cloudinary upload options for videos
export const cloudinaryUploadOptions = {
  resource_type: "video",
  folder: "smartrec-recordings",
  allowed_formats: ["mp4", "webm", "mov", "avi"],
  transformation: [
    { quality: "auto:good" }, // Optimize quality
    { fetch_format: "auto" }, // Auto-format selection
  ],
  eager: [
    // Generate optimized versions
    { width: 1280, height: 720, crop: "scale", quality: "auto:good" },
    { width: 854, height: 480, crop: "scale", quality: "auto:good" },
  ],
  eager_async: true,
  eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
};

// Video editing transformations
export const videoTransformations = {
  trim: (startTime: number, endTime: number) => ({
    start_offset: startTime,
    end_offset: endTime,
  }),
  resize: (width: number, height: number) => ({
    width,
    height,
    crop: "scale",
  }),
  quality: (quality: string) => ({
    quality,
  }),
};
