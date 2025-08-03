import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { ShareService } from "@/lib/services/share-service";
import { verifyIdToken } from "@/lib/firebase/admin";
import type { Recording } from "@/lib/types/recording";

// Verify authentication helper
async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("🔥 API SHARED: Auth verification failed:", error);
    return null;
  }
}

// Get recordings shared with the current user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Get recording IDs shared with this user
      const sharedRecordingIds = await ShareService.getSharedRecordings(
        user.uid,
        user.email
      );

      if (sharedRecordingIds.length === 0) {
        return NextResponse.json([]);
      }

      // Fetch the actual recording data for each shared recording
      const sharedRecordings: Recording[] = [];

      for (const recordingId of sharedRecordingIds) {
        try {
          const recording = await RecordingService.getRecording(recordingId);
          if (recording) {
            // Remove sensitive owner information but keep basic data
            const safeRecording: Recording = {
              ...recording,
              // Keep all recording data but don't expose internal sharing details
            };
            sharedRecordings.push(safeRecording);
          }
        } catch (recordingError) {
          console.warn(
            "🔥 API SHARED: Failed to fetch recording:",
            recordingId,
            recordingError
          );
          // Continue with other recordings
        }
      }

      return NextResponse.json(sharedRecordings);
    } catch (shareError) {
      console.error(
        "🔥 API SHARED: Error fetching shared recordings:",
        shareError
      );
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("🔥 API SHARED: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
