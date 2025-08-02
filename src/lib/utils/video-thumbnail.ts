"use client";

/**
 * Generate a thumbnail from a video blob
 * @param videoBlob - The video blob to generate thumbnail from
 * @param timeInSeconds - Time in video to capture thumbnail (default: 1 second)
 * @returns Promise<string> - Data URL of the thumbnail image
 */
export function generateVideoThumbnail(
  videoBlob: Blob,
  timeInSeconds: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    video.addEventListener("loadedmetadata", () => {
      // Set canvas size to video dimensions (with max width/height for performance)
      const maxWidth = 320;
      const maxHeight = 180;
      const aspectRatio = video.videoWidth / video.videoHeight;

      if (aspectRatio > maxWidth / maxHeight) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
      } else {
        canvas.width = maxHeight * aspectRatio;
        canvas.height = maxHeight;
      }

      // Seek to the specified time (or 1 second, whichever is less)
      const seekTime = Math.min(timeInSeconds, video.duration - 0.1);
      video.currentTime = seekTime;
    });

    video.addEventListener("seeked", () => {
      try {
        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        // Clean up
        video.remove();
        canvas.remove();

        resolve(thumbnailDataUrl);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener("error", (error) => {
      video.remove();
      canvas.remove();
      reject(new Error("Failed to load video for thumbnail generation"));
    });

    // Set video source and load
    video.src = URL.createObjectURL(videoBlob);
    video.load();
  });
}

/**
 * Get video duration from a video blob
 * @param videoBlob - The video blob to get duration from
 * @returns Promise<number> - Duration in seconds
 */
export function getVideoDuration(videoBlob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      video.remove();
      resolve(duration);
    });

    video.addEventListener("error", (error) => {
      video.remove();
      reject(new Error("Failed to load video for duration extraction"));
    });

    // Set video source and load
    video.src = URL.createObjectURL(videoBlob);
    video.load();
  });
}

/**
 * Upload thumbnail to Firebase Storage
 * @param thumbnailDataUrl - Data URL of the thumbnail
 * @param userId - User ID for storage path
 * @param recordingId - Recording ID for filename
 * @returns Promise<string> - Download URL of uploaded thumbnail
 */
export async function uploadThumbnailToStorage(
  thumbnailDataUrl: string,
  userId: string,
  recordingId: string
): Promise<string> {
  try {
    // Convert data URL to blob
    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();

    // Dynamic import to avoid SSR issues
    const { ref, uploadBytes, getDownloadURL } = await import(
      "firebase/storage"
    );
    const { storage } = await import("@/lib/firebase/config");

    // Upload to Firebase Storage
    const thumbnailPath = `recordings/${userId}/thumbnails/${recordingId}.jpg`;
    const storageRef = ref(storage, thumbnailPath);
    const uploadResult = await uploadBytes(storageRef, blob);

    return await getDownloadURL(uploadResult.ref);
  } catch (error) {
    console.error("Failed to upload thumbnail:", error);
    throw error;
  }
}
