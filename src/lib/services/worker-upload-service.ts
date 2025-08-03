"use client";

import type { RecordingMetadata } from "@/lib/types/recording";
import { auth } from "@/lib/firebase/config";

export interface UploadTask {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  createdAt: number;
  blobSize: number;
  recordingId?: string;
}

export interface MemoryInfo {
  current: number;
  limit: number;
  usage: string;
}

class WorkerUploadService {
  private worker: Worker | null = null;
  private listeners: Set<
    (tasks: UploadTask[], memoryInfo: MemoryInfo) => void
  > = new Set();
  private isInitialized = false;

  constructor() {
    this.initWorker();
  }

  private async initWorker() {
    try {
      // Check if Web Workers are supported
      if (typeof Worker === "undefined") {
        console.warn("Web Workers not supported, falling back to main thread");
        return;
      }

      this.worker = new Worker("/upload-worker.js");

      this.worker.onmessage = (event) => {
        const { type, tasks, memoryInfo, taskId, success, error } = event.data;

        switch (type) {
          case "TASKS_UPDATE":
            this.notifyListeners(tasks, memoryInfo);
            break;

          case "TASK_ADDED":
            if (!success) {
              console.error("Failed to add task:", error);
            }
            break;

          case "ERROR":
            console.error("Worker error:", error);
            break;

          case "MEMORY_INFO":
            // Handle memory info updates
            break;

          default:
            console.log("Worker message:", event.data);
        }
      };

      this.worker.onerror = (error) => {
        console.error("Worker error:", error);
      };

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize worker:", error);
    }
  }

  // Add upload task
  async addUploadTask(
    title: string,
    description: string | undefined,
    blob: Blob,
    metadata: RecordingMetadata
  ): Promise<string> {
    if (!this.worker) {
      throw new Error("Upload worker not available");
    }

    // Get auth token
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const authToken = await user.getIdToken();

    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error("Worker not available"));
        return;
      }

      // Listen for response
      const handleMessage = (event: MessageEvent) => {
        const { type, taskId, success, error } = event.data;

        if (type === "TASK_ADDED") {
          this.worker!.removeEventListener("message", handleMessage);
          if (success) {
            resolve(taskId);
          } else {
            reject(new Error(error || "Failed to add task"));
          }
        } else if (type === "ERROR") {
          this.worker!.removeEventListener("message", handleMessage);
          reject(new Error(error));
        }
      };

      this.worker.addEventListener("message", handleMessage);

      // Send task to worker
      this.worker.postMessage({
        type: "ADD_UPLOAD_TASK",
        data: {
          title,
          description,
          blob,
          metadata,
          authToken,
        },
      });
    });
  }

  // Subscribe to task updates
  subscribe(
    listener: (tasks: UploadTask[], memoryInfo: MemoryInfo) => void
  ): () => void {
    this.listeners.add(listener);

    // Request current tasks
    if (this.worker) {
      this.worker.postMessage({ type: "GET_TASKS" });
    }

    return () => this.listeners.delete(listener);
  }

  // Clear specific task
  clearTask(taskId: string): void {
    if (this.worker) {
      this.worker.postMessage({
        type: "CLEAR_TASK",
        data: { taskId },
      });
    }
  }

  // Get memory info
  async getMemoryInfo(): Promise<MemoryInfo> {
    if (!this.worker) {
      return { current: 0, limit: 500, usage: "0/500MB (0%)" };
    }

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        const { type, memoryInfo } = event.data;

        if (type === "MEMORY_INFO") {
          this.worker!.removeEventListener("message", handleMessage);
          resolve(memoryInfo);
        }
      };

      this.worker!.addEventListener("message", handleMessage);
      this.worker.postMessage({ type: "GET_MEMORY_INFO" });
    });
  }

  // Cleanup stale tasks
  cleanupStaleTasks(): void {
    if (this.worker) {
      this.worker.postMessage({ type: "CLEANUP_STALE_TASKS" });
    }
  }

  // Create immediate placeholder recording (for UI)
  createImmediateRecording(
    title: string,
    description: string | undefined,
    metadata: RecordingMetadata,
    duration: number
  ): string {
    const recordingId = `recording_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    // Store in IndexedDB instead of localStorage for larger capacity
    this.storeTemporaryRecording({
      id: recordingId,
      userId: "current_user",
      title,
      description,
      duration,
      size: 0,
      format: "webm" as const,
      quality: metadata.quality,
      fps: metadata.fps,
      recordingType: metadata.recordingType,
      hasAudio: metadata.systemAudioEnabled,
      hasMicrophone: metadata.micEnabled,
      videoUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      views: 0,
      tags: [],
      status: "processing" as const,
    });

    return recordingId;
  }

  // Store temporary recording in IndexedDB
  private async storeTemporaryRecording(recording: any): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["tempRecordings"], "readwrite");
      const store = transaction.objectStore("tempRecordings");
      await store.add(recording);
    } catch (error) {
      console.warn("Failed to store temporary recording:", error);
      // Fallback to localStorage for smaller data
      try {
        const existing = JSON.parse(
          localStorage.getItem("smart_rec_temp_recordings") || "[]"
        );
        existing.push(recording);
        localStorage.setItem(
          "smart_rec_temp_recordings",
          JSON.stringify(existing)
        );
      } catch (fallbackError) {
        console.warn("Fallback storage also failed:", fallbackError);
      }
    }
  }

  // Open IndexedDB
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("SmartRecDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store for temporary recordings
        if (!db.objectStoreNames.contains("tempRecordings")) {
          const store = db.createObjectStore("tempRecordings", {
            keyPath: "id",
          });
          store.createIndex("userId", "userId");
          store.createIndex("status", "status");
        }
      };
    });
  }

  // Get temporary recordings from IndexedDB
  async getTemporaryRecordings(): Promise<any[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["tempRecordings"], "readonly");
      const store = transaction.objectStore("tempRecordings");
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("Failed to get temporary recordings from IndexedDB:", error);
      // Fallback to localStorage
      try {
        return JSON.parse(
          localStorage.getItem("smart_rec_temp_recordings") || "[]"
        );
      } catch {
        return [];
      }
    }
  }

  // Clear temporary recording
  async clearTemporaryRecording(recordingId: string): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["tempRecordings"], "readwrite");
      const store = transaction.objectStore("tempRecordings");
      await store.delete(recordingId);
    } catch (error) {
      console.warn(
        "Failed to clear temporary recording from IndexedDB:",
        error
      );
      // Fallback to localStorage
      try {
        const existing = JSON.parse(
          localStorage.getItem("smart_rec_temp_recordings") || "[]"
        );
        const filtered = existing.filter((r: any) => r.id !== recordingId);
        localStorage.setItem(
          "smart_rec_temp_recordings",
          JSON.stringify(filtered)
        );
      } catch (fallbackError) {
        console.warn("Fallback clear also failed:", fallbackError);
      }
    }
  }

  private notifyListeners(tasks: UploadTask[], memoryInfo: MemoryInfo): void {
    this.listeners.forEach((listener) => listener(tasks, memoryInfo));
  }

  // Cleanup when service is destroyed
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.listeners.clear();
  }
}

// Global singleton instance
export const workerUploadService = new WorkerUploadService();

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    workerUploadService.destroy();
  });
}
