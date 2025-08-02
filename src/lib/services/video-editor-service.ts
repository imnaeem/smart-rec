"use client";

import { auth } from "@/lib/firebase/config";
import {
  generateVideoThumbnail,
  uploadThumbnailToStorage,
  getVideoDuration,
} from "@/lib/utils/video-thumbnail";
import type { RecordingMetadata } from "@/lib/types/recording";

export interface EditedVideoData {
  blob: Blob;
  originalRecordingId: string;
  startTime: number;
  endTime: number;
  title: string;
  description?: string;
}

export class VideoEditorService {
  static async uploadEditedVideo(data: EditedVideoData): Promise<string> {
    try {
      // Get auth token from Firebase Auth
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const authToken = await user.getIdToken();

      // Create form data
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("originalRecordingId", data.originalRecordingId);
      formData.append("startTime", data.startTime.toString());
      formData.append("endTime", data.endTime.toString());

      // Create file from blob
      const fileName = `edited_${Date.now()}.webm`;
      const file = new File([data.blob], fileName, { type: data.blob.type });
      formData.append("file", file);

      const response = await fetch("/api/recordings/edited", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      const recordingId = result.recordingId;

      // Get video duration and generate thumbnail
      try {
        // Get video duration
        const duration = await getVideoDuration(data.blob);

        // Generate and upload thumbnail
        const thumbnailDataUrl = await generateVideoThumbnail(data.blob);
        const thumbnailUrl = await uploadThumbnailToStorage(
          thumbnailDataUrl,
          user.uid,
          recordingId
        );

        // Update recording with duration, thumbnail, and status
        await fetch(`/api/recordings/${recordingId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: "ready",
            duration: duration,
            thumbnail: thumbnailUrl,
          }),
        });
      } catch (processingError) {
        console.warn(
          "Failed to process edited video metadata:",
          processingError
        );
        // Update status to failed if processing fails
        try {
          await fetch(`/api/recordings/${recordingId}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ status: "failed" }),
          });
        } catch (statusError) {
          console.warn("Failed to update status to failed:", statusError);
        }
      }

      return recordingId;
    } catch (error) {
      console.error("Edited video upload error:", error);
      throw error;
    }
  }
}
