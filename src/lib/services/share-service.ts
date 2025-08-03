import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { RecordingService } from "@/lib/firebase/recordings";
import type { SharedRecording, Recording } from "@/lib/types/recording";

const SHARED_RECORDINGS_COLLECTION = "sharedRecordings";

export class ShareService {
  static async shareWithEmail(
    recordingId: string,
    email: string,
    ownerUid: string,
    ownerEmail: string,
    ownerDisplayName: string,
    recordingTitle: string
  ): Promise<void> {
    try {
      // Check if already shared
      const existingQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("recordingId", "==", recordingId),
        where("sharedWithEmail", "==", email.toLowerCase()),
        where("shareType", "==", "email"),
        where("isActive", "==", true)
      );

      const existingShares = await getDocs(existingQuery);
      if (!existingShares.empty) {
        throw new Error("Recording is already shared with this email");
      }

      // Create new share document
      const shareData: Omit<SharedRecording, "id"> = {
        recordingId,
        ownerUid,
        ownerEmail,
        ownerDisplayName,
        sharedWithEmail: email.toLowerCase(),
        shareType: "email",
        permissions: {
          canView: true,
        },
        createdAt: new Date().toISOString(),
        isActive: true,
        recordingTitle,
      };

      await addDoc(collection(db, SHARED_RECORDINGS_COLLECTION), shareData);
    } catch (error) {
      console.error("📧 SHARE: Failed to share recording:", error);
      throw error;
    }
  }

  static async removeShare(recordingId: string, email: string): Promise<void> {
    try {
      const shareQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("recordingId", "==", recordingId),
        where("sharedWithEmail", "==", email.toLowerCase()),
        where("shareType", "==", "email")
      );

      const shares = await getDocs(shareQuery);
      const deletePromises = shares.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("🗑️ SHARE: Failed to remove share:", error);
      throw error;
    }
  }

  static async getShares(): Promise<SharedRecording[]> {
    try {
      const sharesQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("isActive", "==", true)
      );

      const sharesSnapshot = await getDocs(sharesQuery);
      return sharesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SharedRecording[];
    } catch (error) {
      console.error("📊 SHARE: Failed to get shares:", error);
      return [];
    }
  }

  static async getSharesForRecording(recordingId: string): Promise<string[]> {
    try {
      const sharesQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("recordingId", "==", recordingId),
        where("shareType", "==", "email"),
        where("isActive", "==", true)
      );

      const sharesSnapshot = await getDocs(sharesQuery);
      return sharesSnapshot.docs.map((doc) => doc.data().sharedWithEmail);
    } catch (error) {
      console.error("📊 SHARE: Failed to get shares for recording:", error);
      return [];
    }
  }

  static async updateRecordingPublicStatus(
    recordingId: string,
    isPublic: boolean,
    userId: string,
    ownerEmail: string,
    ownerDisplayName: string,
    recordingTitle: string
  ): Promise<{ shareToken?: string }> {
    try {
      let shareToken: string | undefined;

      if (isPublic) {
        // Generate share token
        shareToken = `share_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}`;

        // Create or update public share document
        const publicShareQuery = query(
          collection(db, SHARED_RECORDINGS_COLLECTION),
          where("recordingId", "==", recordingId),
          where("shareType", "==", "public")
        );

        const existingPublicShares = await getDocs(publicShareQuery);

        if (existingPublicShares.empty) {
          // Create new public share
          const publicShareData: Omit<SharedRecording, "id"> = {
            recordingId,
            ownerUid: userId,
            ownerEmail,
            ownerDisplayName,
            sharedWithEmail: "public",
            shareType: "public",
            shareToken,
            permissions: { canView: true },
            createdAt: new Date().toISOString(),
            isActive: true,
            recordingTitle,
          };
          await addDoc(
            collection(db, SHARED_RECORDINGS_COLLECTION),
            publicShareData
          );
        } else {
          // Update existing public share
          const docRef = existingPublicShares.docs[0].ref;
          await updateDoc(docRef, {
            shareToken,
            isActive: true,
            recordingTitle,
          });
        }
      } else {
        // Making private - deactivate public shares
        const publicShareQuery = query(
          collection(db, SHARED_RECORDINGS_COLLECTION),
          where("recordingId", "==", recordingId),
          where("shareType", "==", "public")
        );

        const publicShares = await getDocs(publicShareQuery);
        const deactivatePromises = publicShares.docs.map((doc) =>
          updateDoc(doc.ref, { isActive: false })
        );
        await Promise.all(deactivatePromises);
      }

      // Update the recording using RecordingService
      await RecordingService.updateRecording(recordingId, userId, {
        isPublic,
        shareToken: isPublic ? shareToken : null,
        updatedAt: new Date().toISOString(),
      });

      return { shareToken };
    } catch (error) {
      console.error(
        "🔗 SHARE: Failed to update recording public status:",
        error
      );
      throw error;
    }
  }

  static generateShareUrl(recording: Recording, baseUrl?: string): string {
    const origin =
      baseUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    // Ensure we have a valid recording ID
    if (!recording || !recording.id) {
      console.error(
        "🔗 SHARE: Invalid recording for share URL generation:",
        recording
      );
      return `${origin}/dashboard/recordings`;
    }

    if (recording.isPublic && recording.shareToken) {
      return `${origin}/watch/${recording.id}?token=${recording.shareToken}`;
    } else if (recording.isPublic) {
      return `${origin}/watch/${recording.id}`;
    } else {
      return `${origin}/watch/${recording.id}`; // Private URL
    }
  }

  // Verify if a user can access a recording via share token
  static async verifyPublicAccess(
    recordingId: string,
    token?: string
  ): Promise<boolean> {
    try {
      if (!token) return false;

      const publicShareQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("recordingId", "==", recordingId),
        where("shareType", "==", "public"),
        where("shareToken", "==", token),
        where("isActive", "==", true)
      );

      const shares = await getDocs(publicShareQuery);
      return !shares.empty;
    } catch (error) {
      console.error("🔗 SHARE: Failed to verify public access:", error);
      return false;
    }
  }

  // Check if a user has access to a recording via email share
  static async verifyEmailAccess(
    recordingId: string,
    userUid: string,
    userEmail?: string
  ): Promise<boolean> {
    try {
      // First check by userUid
      const uidQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("recordingId", "==", recordingId),
        where("sharedWithUid", "==", userUid),
        where("shareType", "==", "email"),
        where("isActive", "==", true)
      );

      const uidShares = await getDocs(uidQuery);
      if (!uidShares.empty) return true;

      // If no UID match and userEmail provided, check by email
      if (userEmail) {
        const emailQuery = query(
          collection(db, SHARED_RECORDINGS_COLLECTION),
          where("recordingId", "==", recordingId),
          where("sharedWithEmail", "==", userEmail.toLowerCase()),
          where("shareType", "==", "email"),
          where("isActive", "==", true)
        );

        const emailShares = await getDocs(emailQuery);
        return !emailShares.empty;
      }

      return false;
    } catch (error) {
      console.error("🔗 SHARE: Failed to verify email access:", error);
      return false;
    }
  }

  // Claim shares for a user when they log in (link email shares to their UID)
  static async claimUserShares(
    userUid: string,
    userEmail: string
  ): Promise<void> {
    try {
      // Find shares by email that don't have a UID yet
      const unclaimedQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("sharedWithEmail", "==", userEmail.toLowerCase()),
        where("shareType", "==", "email"),
        where("isActive", "==", true)
      );

      const unclaimedShares = await getDocs(unclaimedQuery);

      // Update each unclaimed share with the user's UID
      const updatePromises = unclaimedShares.docs
        .filter((doc) => !doc.data().sharedWithUid) // Only update if UID is not set
        .map((doc) => updateDoc(doc.ref, { sharedWithUid: userUid }));

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("🔗 SHARE: Failed to claim user shares:", error);
      // Don't throw error as this is a background operation
    }
  }

  // Get shared recordings for a user (by both UID and email)
  static async getSharedRecordings(
    userUid: string,
    userEmail?: string
  ): Promise<string[]> {
    try {
      const recordingIds = new Set<string>();

      // Get shares by UID
      const uidQuery = query(
        collection(db, SHARED_RECORDINGS_COLLECTION),
        where("sharedWithUid", "==", userUid),
        where("shareType", "==", "email"),
        where("isActive", "==", true)
      );

      const uidShares = await getDocs(uidQuery);
      uidShares.docs.forEach((doc) => recordingIds.add(doc.data().recordingId));

      // Also get shares by email (for cases where UID hasn't been claimed yet)
      if (userEmail) {
        const emailQuery = query(
          collection(db, SHARED_RECORDINGS_COLLECTION),
          where("sharedWithEmail", "==", userEmail.toLowerCase()),
          where("shareType", "==", "email"),
          where("isActive", "==", true)
        );

        const emailShares = await getDocs(emailQuery);
        emailShares.docs.forEach((doc) =>
          recordingIds.add(doc.data().recordingId)
        );
      }

      return Array.from(recordingIds);
    } catch (error) {
      console.error("📊 SHARE: Failed to get shared recordings:", error);
      return [];
    }
  }
}
