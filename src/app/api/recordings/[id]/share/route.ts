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
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPublic } = await request.json();
    const recordingId = params.id;

    // Get the recording to verify ownership
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    if (recording.userId !== user.uid) {
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
