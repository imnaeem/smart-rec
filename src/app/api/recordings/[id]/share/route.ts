import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { ShareService } from "@/lib/services/share-service";
import { verifyIdToken } from "@/lib/firebase/admin";

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
    console.error("🔥 API SHARE: Auth verification failed:", error);
    return null;
  }
}

// Update recording sharing settings (public/private)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔥 API SHARE: PUT /api/recordings/[id]/share called");
    const user = await verifyAuth(request);

    if (!user) {
      console.log("🔥 API SHARE: Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPublic } = await request.json();
    const recordingId = params.id;

    console.log("🔥 API SHARE: User authenticated:", {
      uid: user.uid,
      email: user.email,
    });
    console.log(
      "🔥 API SHARE: Updating recording:",
      recordingId,
      "isPublic:",
      isPublic
    );

    // Get the recording to verify ownership
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      console.log("🔥 API SHARE: Recording not found:", recordingId);
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    if (recording.userId !== user.uid) {
      console.log("🔥 API SHARE: Access denied - not owner:", {
        recordingOwner: recording.userId,
        requestUser: user.uid,
      });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Use ShareService to handle the public status update
    try {
      const result = await ShareService.updateRecordingPublicStatus(
        recordingId,
        isPublic,
        user.uid,
        user.email || "",
        user.name || user.email || "",
        recording.title || "Untitled Recording"
      );

      console.log("🔥 API SHARE: Share status updated successfully");
      return NextResponse.json({
        success: true,
        shareToken: result.shareToken,
      });
    } catch (shareError) {
      console.error("🔥 API SHARE: ShareService error:", shareError);
      return NextResponse.json(
        { error: "Failed to update sharing settings" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("🔥 API SHARE: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
