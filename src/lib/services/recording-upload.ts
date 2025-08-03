"use client";

import { auth } from "@/lib/firebase/config";
import type { RecordingMetadata } from "@/lib/types/recording";
import {
  generateVideoThumbnail,
  uploadThumbnailToStorage,
  getVideoDuration,
} from "@/lib/utils/video-thumbnail";

export interface UploadRecordingRequest {
  title: string;
  description?: string;
  blob: Blob;
  metadata: RecordingMetadata;
}

export class RecordingUploadService {
  // Simple cache to prevent duplicate API calls
  private static cache: {
    data: any[] | null;
    timestamp: number;
    userId: string | null;
  } = { data: null, timestamp: 0, userId: null };

  private static CACHE_DURATION = 30000; // 30 seconds

  // Clear cache to force fresh data fetch
  static clearCache() {
    this.cache = { data: null, timestamp: 0, userId: null };
  }
  static async uploadRecording(data: UploadRecordingRequest): Promise<string> {
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
      formData.append("recordingType", data.metadata.recordingType);
      formData.append("quality", data.metadata.quality);
      formData.append("fps", data.metadata.fps.toString());
      formData.append("hasMicrophone", data.metadata.micEnabled.toString());
      formData.append("hasAudio", data.metadata.systemAudioEnabled.toString());

      // Create file from blob
      const fileName = `recording_${Date.now()}.${
        data.blob.type.includes("mp4") ? "mp4" : "webm"
      }`;
      const file = new File([data.blob], fileName, { type: data.blob.type });
      formData.append("file", file);

      const response = await fetch("/api/recordings", {
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
        console.warn("Failed to process video metadata:", processingError);
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

      // Clear cache so fresh data is fetched next time
      this.clearCache();

      return recordingId;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  static async getUserRecordings(): Promise<any[]> {
    try {
      // Get auth token from Firebase Auth
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check cache first
      const now = Date.now();
      const isCacheValid =
        this.cache.data &&
        this.cache.userId === user.uid &&
        now - this.cache.timestamp < this.CACHE_DURATION;

      if (isCacheValid) {
        return this.cache.data!;
      }

      const authToken = await user.getIdToken();

      const response = await fetch("/api/recordings", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔥 SERVICE: API error response:", errorText);
        throw new Error(`Failed to fetch recordings: ${response.status}`);
      }

      const result = await response.json();

      const recordings = result.recordings || [];

      // Update cache
      this.cache = {
        data: recordings,
        timestamp: now,
        userId: user.uid,
      };

      return recordings;
    } catch (error) {
      console.error("🔥 SERVICE: Fetch recordings error:", error);
      throw error;
    }
  }
}
