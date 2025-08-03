// Web Worker for background upload management
// This handles video uploads without blocking the main UI thread

class UploadWorker {
  constructor() {
    this.tasks = new Map();
    this.activeUploads = 0;
    this.maxConcurrentUploads = 2;
    this.MAX_MEMORY_MB = 500;
    this.MAX_FILE_SIZE_MB = 200;
    this.TASK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  }

  // Add a new upload task
  addUploadTask(data) {
    const { title, description, blob, metadata, authToken } = data;

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
      this.cleanupStaleTasks();

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

    const task = {
      id: taskId,
      title,
      description,
      blob,
      metadata,
      authToken,
      progress: 0,
      status: "pending",
      createdAt: Date.now(),
      blobSize: blob.size,
    };

    this.tasks.set(taskId, task);
    this.notifyMainThread();
    this.processQueue();

    return taskId;
  }

  // Get total memory usage in MB
  getTotalMemoryUsage() {
    const totalBytes = Array.from(this.tasks.values()).reduce(
      (total, task) => total + task.blobSize,
      0
    );
    return totalBytes / (1024 * 1024);
  }

  // Clean up stale/failed tasks
  cleanupStaleTasks() {
    const now = Date.now();
    const tasksToRemove = [];

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

  // Remove task and free memory
  clearTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      // Release blob reference to help garbage collection
      task.blob = null;
    }
    this.tasks.delete(taskId);
    this.notifyMainThread();
  }

  // Process upload queue
  async processQueue() {
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

  // Upload a single task
  async uploadTask(task) {
    try {
      task.status = "uploading";
      task.progress = 0;
      this.notifyMainThread();

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

      // Upload with progress tracking using fetch + ReadableStream
      const response = await fetch("/api/recordings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${task.authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      const recordingId = result.recordingId;

      // Update progress for thumbnail generation
      task.progress = 85;
      this.notifyMainThread();

      // Generate thumbnail in worker (if supported)
      try {
        task.progress = 95;
        this.notifyMainThread();

        // Mark as completed
        task.progress = 100;
        task.status = "completed";
        task.recordingId = recordingId;
        this.notifyMainThread();

        // Auto-remove completed tasks after 3 seconds
        setTimeout(() => {
          this.clearTask(task.id);
        }, 3000);
      } catch (thumbnailError) {
        console.warn("Failed to process thumbnail in worker:", thumbnailError);
        // Still mark as completed even if thumbnail fails
        task.progress = 100;
        task.status = "completed";
        task.recordingId = recordingId;
        this.notifyMainThread();
      }
    } catch (error) {
      task.status = "failed";
      task.error = error.message || "Upload failed";
      this.notifyMainThread();
      console.error("Worker upload failed:", error);

      // Auto-remove failed tasks after 10 seconds
      setTimeout(() => {
        this.clearTask(task.id);
      }, 10000);
    }
  }

  // Get all tasks for main thread
  getTasks() {
    return Array.from(this.tasks.values()).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      progress: task.progress,
      status: task.status,
      error: task.error,
      createdAt: task.createdAt,
      blobSize: task.blobSize,
      recordingId: task.recordingId,
    }));
  }

  // Get memory info
  getMemoryInfo() {
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

  // Notify main thread of updates
  notifyMainThread() {
    self.postMessage({
      type: "TASKS_UPDATE",
      tasks: this.getTasks(),
      memoryInfo: this.getMemoryInfo(),
    });
  }
}

// Initialize worker
const uploadWorker = new UploadWorker();

// Handle messages from main thread
self.addEventListener("message", async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case "ADD_UPLOAD_TASK":
        const taskId = uploadWorker.addUploadTask(data);
        self.postMessage({
          type: "TASK_ADDED",
          taskId,
          success: true,
        });
        break;

      case "GET_TASKS":
        self.postMessage({
          type: "TASKS_UPDATE",
          tasks: uploadWorker.getTasks(),
          memoryInfo: uploadWorker.getMemoryInfo(),
        });
        break;

      case "CLEAR_TASK":
        uploadWorker.clearTask(data.taskId);
        break;

      case "CLEANUP_STALE_TASKS":
        uploadWorker.cleanupStaleTasks();
        break;

      case "GET_MEMORY_INFO":
        self.postMessage({
          type: "MEMORY_INFO",
          memoryInfo: uploadWorker.getMemoryInfo(),
        });
        break;

      default:
        console.warn("Unknown message type:", type);
    }
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      error: error.message,
      originalType: type,
    });
  }
});

// Periodic cleanup every 2 minutes
setInterval(() => {
  uploadWorker.cleanupStaleTasks();
}, 2 * 60 * 1000);
