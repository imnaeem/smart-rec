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
    console.error("🔥 API SHARED ID: Auth verification failed:", error);
    return null;
  }
}

// Get shared recording by ID (requires authentication)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recordingId } = await params;

    // Get the recording using Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Check access permissions for shared recordings
    let hasAccess = false;

    // For shared endpoint, we allow access to:
    // 1. Public recordings
    // 2. Private recordings explicitly shared with this user

    if (recording.isPublic) {
      hasAccess = true;
    } else {
      // For private recordings, check if shared with this user
      hasAccess = await ShareService.verifyEmailAccess(
        recordingId,
        user.uid,
        user.email
      );
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "This recording is private and not shared with you" },
        { status: 403 }
      );
    }

    // Prepare recording data - keep all data but mark it as shared
    const accessibleRecording: Recording = {
      ...recording,
      // Mark this as a shared recording in the response
      sharedWith:
        recording.userId !== user.uid
          ? [
              {
                uid: user.uid,
                email: user.email || "",
                sharedAt: new Date().toISOString(),
              },
            ]
          : undefined,
    };

    return NextResponse.json(accessibleRecording);
  } catch (error) {
    console.error("🔥 API SHARED ID: Error fetching shared recording:", error);
    console.error("🔥 API SHARED ID: Error fetching shared recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
