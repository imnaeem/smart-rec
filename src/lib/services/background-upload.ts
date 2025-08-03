"use client";

import { auth } from "@/lib/firebase/config";
import type { RecordingMetadata } from "@/lib/types/recording";
import {
  generateVideoThumbnail,
  uploadThumbnailToStorage,
} from "@/lib/utils/video-thumbnail";

export interface UploadTask {
  id: string;
  title: string;
  description?: string;
  blob: Blob;
  metadata: RecordingMetadata;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  createdAt: number;
  blobSize: number;
}

class BackgroundUploadService {
  private tasks: Map<string, UploadTask> = new Map();
  private activeUploads = 0;
  private maxConcurrentUploads = 2;
  private listeners: Set<(tasks: UploadTask[]) => void> = new Set();
  private readonly MAX_MEMORY_MB = 500; // 500MB max memory usage
  private readonly MAX_FILE_SIZE_MB = 200; // 200MB max file size
  private readonly TASK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes timeout

  // Add a new upload task
  addUploadTask(
    title: string,
    description: string | undefined,
    blob: Blob,
    metadata: RecordingMetadata
  ): string {
    // Check file size limit
    const fileSizeMB = blob.size / (1024 * 1024);
    if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
      throw new Error(
        `File size (${fileSizeMB.toFixed(1)}MB) exceeds limit of ${
          this.MAX_FILE_SIZE_MB
        }MB`
      );
    }

    // Check total memory usage
    const currentMemoryMB = this.getTotalMemoryUsage();
    if (currentMemoryMB + fileSizeMB > this.MAX_MEMORY_MB) {
      // Clean up old/failed tasks first
      this.cleanupStaleTasks();

      // Check again after cleanup
      const newMemoryMB = this.getTotalMemoryUsage();
      if (newMemoryMB + fileSizeMB > this.MAX_MEMORY_MB) {
        throw new Error(
          `Memory limit exceeded. Current: ${newMemoryMB.toFixed(
            1
          )}MB, Adding: ${fileSizeMB.toFixed(1)}MB, Limit: ${
            this.MAX_MEMORY_MB
          }MB`
        );
      }
    }

    const taskId = `upload_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    const task: UploadTask = {
      id: taskId,
      title,
      description,
      blob,
      metadata,
      progress: 0,
      status: "pending",
      createdAt: Date.now(),
      blobSize: blob.size,
    };

    this.tasks.set(taskId, task);
    this.notifyListeners();
    this.processQueue();

    return taskId;
  }

  // Get all tasks
  getTasks(): UploadTask[] {
    return Array.from(this.tasks.values());
  }

  // Get task by ID
  getTask(taskId: string): UploadTask | undefined {
    return this.tasks.get(taskId);
  }

  // Subscribe to task updates
  subscribe(listener: (tasks: UploadTask[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Remove completed/failed tasks
  clearTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      // Release blob reference to help garbage collection
      task.blob = null as any;
    }
    this.tasks.delete(taskId);
    this.notifyListeners();
  }

  // Get total memory usage in MB
  private getTotalMemoryUsage(): number {
    const totalBytes = Array.from(this.tasks.values()).reduce(
      (total, task) => total + task.blobSize,
      0
    );
    return totalBytes / (1024 * 1024);
  }

  // Clean up stale/failed tasks
  private cleanupStaleTasks(): void {
    const now = Date.now();
    const tasksToRemove: string[] = [];

    for (const [taskId, task] of this.tasks.entries()) {
      const isStale = now - task.createdAt > this.TASK_TIMEOUT_MS;
      const shouldRemove =
        task.status === "failed" || task.status === "completed" || isStale;

      if (shouldRemove) {
        tasksToRemove.push(taskId);
      }
    }

    tasksToRemove.forEach((taskId) => this.clearTask(taskId));
  }

  // Get memory usage info
  getMemoryInfo(): { current: number; limit: number; usage: string } {
    const current = this.getTotalMemoryUsage();
    return {
      current,
      limit: this.MAX_MEMORY_MB,
      usage: `${current.toFixed(1)}/${this.MAX_MEMORY_MB}MB (${(
        (current / this.MAX_MEMORY_MB) *
        100
      ).toFixed(1)}%)`,
    };
  }

  private notifyListeners(): void {
    const tasks = this.getTasks();
    this.listeners.forEach((listener) => listener(tasks));
  }

  private async processQueue(): Promise<void> {
    if (this.activeUploads >= this.maxConcurrentUploads) {
      return;
    }

    const pendingTask = Array.from(this.tasks.values()).find(
      (task) => task.status === "pending"
    );

    if (!pendingTask) {
      return;
    }

    this.activeUploads++;
    await this.uploadTask(pendingTask);
    this.activeUploads--;

    // Process next task in queue
    this.processQueue();
  }

  private async uploadTask(task: UploadTask): Promise<void> {
    try {
      // Update task status
      task.status = "uploading";
      task.progress = 0;
      this.notifyListeners();

      // Get auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const authToken = await user.getIdToken();

      // Create form data
      const formData = new FormData();
      formData.append("title", task.title);
      if (task.description) {
        formData.append("description", task.description);
      }
      formData.append("metadata", JSON.stringify(task.metadata));

      // Create file from blob
      const fileName = `recording_${Date.now()}.${
        task.blob.type.includes("mp4") ? "mp4" : "webm"
      }`;
      const file = new File([task.blob], fileName, { type: task.blob.type });
      formData.append("file", file);

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 80); // Reserve 20% for post-processing
            task.progress = progress;
            this.notifyListeners();
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 201) {
            const result = JSON.parse(xhr.responseText);
            resolve(result.recordingId);
          } else {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || "Upload failed"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", "/api/recordings");
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
        xhr.send(formData);
      });

      const recordingId = await uploadPromise;

      // Update progress for thumbnail generation
      task.progress = 85;
      this.notifyListeners();

      // Generate and upload thumbnail (non-blocking)
      try {
        const thumbnailDataUrl = await generateVideoThumbnail(task.blob);
        task.progress = 90;
        this.notifyListeners();

        const thumbnailUrl = await uploadThumbnailToStorage(
          thumbnailDataUrl,
          user.uid,
          recordingId
        );

        task.progress = 95;
        this.notifyListeners();

        // Update recording with thumbnail URL
        await fetch(`/api/recordings/${recordingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ thumbnail: thumbnailUrl }),
        });
      } catch (thumbnailError) {
        console.warn("Failed to generate/upload thumbnail:", thumbnailError);
        // Don't fail the entire upload for thumbnail issues
      }

      // Mark as completed
      task.progress = 100;
      task.status = "completed";
      this.notifyListeners();

      // Auto-remove completed tasks after 3 seconds to free memory faster
      setTimeout(() => {
        this.clearTask(task.id);
      }, 3000);
    } catch (error) {
      task.status = "failed";
      task.error = error instanceof Error ? error.message : "Upload failed";
      this.notifyListeners();
      console.error("Upload failed:", error);

      // Auto-remove failed tasks after 10 seconds to free memory
      setTimeout(() => {
        this.clearTask(task.id);
      }, 10000);
    }
  }

  // Add method to create immediate placeholder recording
  createImmediateRecording(
    title: string,
    description: string | undefined,
    metadata: RecordingMetadata,
    duration: number
  ): string {
    const recordingId = `recording_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    // Create a placeholder recording that appears immediately
    const placeholderRecording = {
      id: recordingId,
      userId: "current_user", // Will be replaced server-side
      title,
      description,
      duration,
      size: 0, // Will be updated after upload
      format: "webm" as const,
      quality: metadata.quality,
      fps: metadata.fps,
      recordingType: metadata.recordingType,
      hasAudio: metadata.systemAudioEnabled,
      hasMicrophone: metadata.micEnabled,
      videoUrl: "", // Will be updated after upload
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      views: 0,
      tags: [],
      status: "processing" as const,
    };

    // Store placeholder in localStorage temporarily
    try {
      const existingRecordings = JSON.parse(
        localStorage.getItem("smart_rec_temp_recordings") || "[]"
      );
      existingRecordings.push(placeholderRecording);
      localStorage.setItem(
        "smart_rec_temp_recordings",
        JSON.stringify(existingRecordings)
      );
    } catch (error) {
      console.warn("Failed to store temporary recording:", error);
    }

    return recordingId;
  }

  // Get temporary recordings
  getTemporaryRecordings() {
    try {
      return JSON.parse(
        localStorage.getItem("smart_rec_temp_recordings") || "[]"
      );
    } catch {
      return [];
    }
  }

  // Clear temporary recording
  clearTemporaryRecording(recordingId: string) {
    try {
      const existingRecordings = JSON.parse(
        localStorage.getItem("smart_rec_temp_recordings") || "[]"
      );
      const filtered = existingRecordings.filter(
        (r: any) => r.id !== recordingId
      );
      localStorage.setItem(
        "smart_rec_temp_recordings",
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.warn("Failed to clear temporary recording:", error);
    }
  }
}

// Global singleton instance
export const backgroundUploadService = new BackgroundUploadService();

// Periodic cleanup every 2 minutes
setInterval(() => {
  backgroundUploadService["cleanupStaleTasks"]();
}, 2 * 60 * 1000);
