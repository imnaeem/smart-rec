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
    console.log(
      "🔥 API VIEW: Auth failed, continuing as anonymous:",
      error.message
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
    console.log("🔥 API VIEW: Incrementing view count for:", recordingId);

    // Get user info if authenticated (optional for public videos)
    const user = await verifyAuth(request);

    // Get the recording using client-side Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      console.log("🔥 API VIEW: Recording not found:", recordingId);
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
      console.log("🔥 API VIEW: Public recording, access granted");
    } else if (user) {
      // For private recordings, check if user is owner or has shared access
      if (user.uid === recording.userId) {
        hasAccess = true;
        console.log("🔥 API VIEW: User is owner, access granted");
      } else {
        // Check if recording is shared with this user
        hasAccess = await ShareService.verifyEmailAccess(
          recordingId,
          user.uid,
          user.email
        );
        console.log("🔥 API VIEW: Shared access check result:", hasAccess);
      }
    } else {
      // Anonymous user trying to access private recording
      console.log(
        "🔥 API VIEW: Anonymous user, private recording, access denied"
      );
    }

    if (!hasAccess) {
      console.log("🔥 API VIEW: Access denied for recording:", recordingId);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Increment view count using client-side Firebase
    await RecordingService.incrementViews(recordingId);

    console.log(
      "🔥 API VIEW: View count incremented successfully for recording:",
      recordingId
    );
    if (user) {
      console.log("🔥 API VIEW: View recorded for user:", user.uid);
    } else {
      console.log("🔥 API VIEW: Anonymous view recorded");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
