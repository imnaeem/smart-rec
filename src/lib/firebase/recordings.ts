import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./config";
import type {
  Recording,
  CreateRecordingRequest,
  UpdateRecordingRequest,
} from "@/lib/types/recording";

const RECORDINGS_COLLECTION = "recordings";
const STORAGE_PATH = "recordings";

export class RecordingService {
  // Test Firebase connectivity
  static async testConnection(): Promise<boolean> {
    try {
      const testCollection = collection(db, "test");
      const testQuery = query(testCollection, limit(1));
      await getDocs(testQuery);

      return true;
    } catch (error) {
      console.error("🔥 FIREBASE: Connection test failed:", error);
      return false;
    }
  }
  // Create a new recording with Cloudinary data
  static async createRecordingWithCloudinary(
    userId: string,
    data: {
      title: string;
      description: string;
      metadata: any;
      videoUrl: string;
      thumbnail: string;
      duration: number;
      size: number;
      width: number;
      height: number;
      format: string;
      cloudinaryPublicId: string;
      status: string;
    }
  ): Promise<string> {
    try {
      // Create recording document with Cloudinary data
      const recordingData: Omit<Recording, "id"> = {
        userId,
        title: data.title,
        description: data.description,
        duration: data.duration,
        size: data.size,
        format: data.format as "mp4" | "webm",
        quality: data.metadata.quality,
        fps: data.metadata.fps,
        recordingType: data.metadata.recordingType,
        hasAudio: data.metadata.systemAudioEnabled,
        hasMicrophone: data.metadata.micEnabled,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail,
        width: data.width,
        height: data.height,
        cloudinaryPublicId: data.cloudinaryPublicId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        views: 0,
        tags: [],
        status: data.status as Recording["status"],
      };

      const docRef = await addDoc(
        collection(db, RECORDINGS_COLLECTION),
        recordingData
      );

      return docRef.id;
    } catch (error) {
      console.error("🔥 FIREBASE: Error creating recording:", error);
      throw new Error("Failed to create recording");
    }
  }

  // Create a new recording (legacy method for Firebase Storage)
  static async createRecording(
    userId: string,
    data: CreateRecordingRequest
  ): Promise<string> {
    try {
      // Upload video file to Firebase Storage
      const fileName = `${userId}_${Date.now()}.${data.file.name
        .split(".")
        .pop()}`;
      const storageRef = ref(storage, `${STORAGE_PATH}/${userId}/${fileName}`);

      // Upload file with basic metadata
      const metadata = {
        contentType: data.file.type || "video/mp4",
      };

      const uploadResult = await uploadBytes(storageRef, data.file, metadata);
      const videoUrl = await getDownloadURL(uploadResult.ref);

      // Create recording document
      const recordingData: Omit<Recording, "id"> = {
        userId,
        title: data.title,
        description: data.description,
        duration: 0, // Will be updated after processing
        size: data.file.size,
        format: data.file.name.endsWith(".mp4") ? "mp4" : "webm",
        quality: data.metadata.quality,
        fps: data.metadata.fps,
        recordingType: data.metadata.recordingType,
        hasAudio: data.metadata.systemAudioEnabled,
        hasMicrophone: data.metadata.micEnabled,
        videoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        views: 0,
        tags: [],
        status: "processing",
        ...(data.originalRecordingId && {
          originalRecordingId: data.originalRecordingId,
        }),
        ...(data.editInfo && { editInfo: data.editInfo }),
      };

      const docRef = await addDoc(
        collection(db, RECORDINGS_COLLECTION),
        recordingData
      );

      return docRef.id;
    } catch (error) {
      console.error("🔥 FIREBASE: Error creating recording:", error);
      throw new Error("Failed to create recording");
    }
  }

  // Get recording by ID
  static async getRecording(recordingId: string): Promise<Recording | null> {
    try {
      const docRef = doc(db, RECORDINGS_COLLECTION, recordingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Recording;
    } catch (error) {
      console.error("Error getting recording:", error);
      throw new Error("Failed to get recording");
    }
  }

  // Get user's recordings
  static async getUserRecordings(
    userId: string,
    limitCount: number = 20
  ): Promise<Recording[]> {
    try {
      const q = query(
        collection(db, RECORDINGS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      // Add timeout to Firestore query - reduced for faster UX
      const queryPromise = getDocs(q);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Firestore query timeout")), 5000)
      );

      const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);

      const recordings = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const recording = {
          id: doc.id,
          ...data,
        } as Recording;

        return recording;
      });

      return recordings;
    } catch (error) {
      console.error("🔥 FIREBASE: Error getting user recordings:", error);

      // Return empty array instead of throwing to prevent API hanging
      return [];
    }
  }

  // Update recording
  static async updateRecording(
    recordingId: string,
    userId: string,
    updates: UpdateRecordingRequest
  ): Promise<void> {
    try {
      const docRef = doc(db, RECORDINGS_COLLECTION, recordingId);

      // Verify ownership
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("🔥 FIREBASE: Recording not found:", recordingId);
        throw new Error("Recording not found");
      }

      const recordingData = docSnap.data();

      if (recordingData.userId !== userId) {
        console.error("🔥 FIREBASE: Access denied - userId mismatch");
        throw new Error("Access denied");
      }

      await updateDoc(docRef, updates as Partial<Recording>);
    } catch (error) {
      console.error("🔥 FIREBASE: Error updating recording:", error);
      throw new Error("Failed to update recording");
    }
  }

  // Delete recording
  static async deleteRecording(
    recordingId: string,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, RECORDINGS_COLLECTION, recordingId);

      // Get recording data
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || docSnap.data().userId !== userId) {
        throw new Error("Recording not found or access denied");
      }

      const recording = docSnap.data() as Recording;

      // Note: Cloudinary deletion is handled server-side in the API route
      // to avoid client-side Node.js module issues

      // Delete video file from Firebase storage if it exists
      if (recording.videoUrl && recording.videoUrl.includes("firebase")) {
        try {
          const videoRef = ref(storage, recording.videoUrl);
          await deleteObject(videoRef);
        } catch (storageError) {
          console.warn("Failed to delete from Firebase storage:", storageError);
        }
      }

      // Delete thumbnail if exists
      if (recording.thumbnail && recording.thumbnail.includes("firebase")) {
        try {
          const thumbnailRef = ref(storage, recording.thumbnail);
          await deleteObject(thumbnailRef);
        } catch (thumbnailError) {
          console.warn(
            "Failed to delete thumbnail from Firebase storage:",
            thumbnailError
          );
        }
      }

      // Delete document from Firestore
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting recording:", error);
      throw new Error("Failed to delete recording");
    }
  }

  // Increment view count
  static async incrementViews(recordingId: string): Promise<void> {
    try {
      const docRef = doc(db, RECORDINGS_COLLECTION, recordingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1,
        });
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Don't throw error for view counting failure
    }
  }

  // Update recording status (after processing)
  static async updateRecordingStatus(
    recordingId: string,
    status: Recording["status"],
    duration?: number,
    thumbnailUrl?: string
  ): Promise<void> {
    try {
      const updates: Partial<Recording> = {
        status,
        updatedAt: new Date().toISOString(),
      };

      if (duration !== undefined) {
        updates.duration = duration;
      }

      if (thumbnailUrl) {
        updates.thumbnail = thumbnailUrl;
      }

      const docRef = doc(db, RECORDINGS_COLLECTION, recordingId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating recording status:", error);
      throw new Error("Failed to update recording status");
    }
  }
}
