import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { verifyIdToken } from "@/lib/firebase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    const recordingId = params.id;
    const body = await request.json();
    const { status, duration, thumbnail } = body;

    // Update recording status
    await RecordingService.updateRecordingStatus(
      recordingId,
      status,
      duration,
      thumbnail
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating recording status:", error);
    return NextResponse.json(
      { error: "Failed to update recording status" },
      { status: 500 }
    );
  }
}
