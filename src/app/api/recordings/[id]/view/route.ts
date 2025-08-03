import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { ShareService } from "@/lib/services/share-service";

// Helper to verify user authentication (optional for view counting)
async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    const { verifyIdToken } = await import("@/lib/firebase/admin");
    const decodedToken = await verifyIdToken(token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
    };
  } catch (error) {
    console.error(
      "🔥 API VIEW: Auth failed, continuing as anonymous:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

// Increment view count for a recording
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordingId = params.id;

    // Get user info if authenticated (optional for public videos)
    const user = await verifyAuth(request);

    // Get the recording using client-side Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this recording
    let hasAccess = false;

    if (recording.isPublic) {
      // Public recordings are accessible to everyone
      hasAccess = true;
    } else if (user) {
      // For private recordings, check if user is owner or has shared access
      if (user.uid === recording.userId) {
        hasAccess = true;
      } else {
        // Check if recording is shared with this user
        hasAccess = await ShareService.verifyEmailAccess(
          recordingId,
          user.uid,
          user.email
        );
      }
    }
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Increment view count using client-side Firebase
    await RecordingService.incrementViews(recordingId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 API VIEW: Error updating view count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
