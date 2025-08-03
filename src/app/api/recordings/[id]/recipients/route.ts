import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordingId = params.id;

    if (!recordingId) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // Get recording details to find owner and shared users
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    const recipients: string[] = [];

    // Add recording owner
    if (recording.userId) {
      recipients.push(recording.userId);
    }

    // Add shared users
    if (recording.sharedWith && Array.isArray(recording.sharedWith)) {
      recording.sharedWith.forEach((sharedUser: { userId?: string }) => {
        if (sharedUser.userId && !recipients.includes(sharedUser.userId)) {
          recipients.push(sharedUser.userId);
        }
      });
    }

    console.log(
      `📋 RECIPIENTS: Found ${recipients.length} recipients for recording ${recordingId}`
    );

    return NextResponse.json({
      recipients,
      recordingTitle: recording.title,
    });
  } catch (error) {
    console.error("Error getting notification recipients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
