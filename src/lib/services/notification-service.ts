import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type {
  Notification,
  CreateNotificationData,
} from "@/lib/types/notification";

export class NotificationService {
  private static COLLECTION = "notifications";

  /**
   * Create a new notification
   */
  static async createNotification(
    data: CreateNotificationData
  ): Promise<string> {
    try {
      const notificationData = {
        ...data,
        isRead: false,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION),
        notificationData
      );
      return docRef.id;
    } catch (error) {
      console.error("❌ NOTIFICATION: Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Listen to real-time notifications for a user
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    const q = query(
      collection(db, this.COLLECTION),
      where("recipientId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(50) // Last 50 notifications
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifications: Notification[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          notifications.push({
            id: doc.id,
            ...data,
            // Handle Firestore Timestamp
            createdAt: data.createdAt || new Date().toISOString(),
            timestamp: data.timestamp || Date.now(),
          } as Notification);
        });

        callback(notifications);
      },
      (error) => {
        console.error(
          "❌ NOTIFICATION: Error in notifications listener:",
          error
        );
      }
    );

    return unsubscribe;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error("❌ NOTIFICATION: Error marking as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      // This would require a batch update in a real implementation
      // For now, we'll handle it in the client
      console.log("📝 NOTIFICATION: Mark all as read for user:", userId);
    } catch (error) {
      console.error("❌ NOTIFICATION: Error marking all as read:", error);
      throw error;
    }
  }

  /**
   * Get users who should receive notifications for a recording
   */
  static async getNotificationRecipients(
    recordingId: string,
    senderId: string
  ): Promise<string[]> {
    try {
      // Import here to avoid issues with server-side imports
      const { RecordingService } = await import("@/lib/firebase/recordings");
      const { collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase/config");

      // Get recording data directly from database
      const recording = await RecordingService.getRecording(recordingId);

      if (!recording) {
        console.warn("Recording not found for notifications:", recordingId);
        return [];
      }

      const recipients: string[] = [];

      // Add recording owner (if sender is not the owner)
      if (recording.userId && recording.userId !== senderId) {
        recipients.push(recording.userId);
      }

      // Get shared users from sharedRecordings collection
      const sharedQuery = query(
        collection(db, "sharedRecordings"),
        where("recordingId", "==", recordingId),
        where("isActive", "==", true)
      );

      const sharedSnapshot = await getDocs(sharedQuery);

      sharedSnapshot.forEach((doc) => {
        const shareData = doc.data();
        // Add shared user if they have a userId and are not the sender
        if (
          shareData.sharedWithUid &&
          shareData.sharedWithUid !== senderId &&
          !recipients.includes(shareData.sharedWithUid)
        ) {
          recipients.push(shareData.sharedWithUid);
        }
      });

      return recipients;
    } catch (error) {
      console.error("❌ NOTIFICATION: Error getting recipients:", error);
      return [];
    }
  }
}
