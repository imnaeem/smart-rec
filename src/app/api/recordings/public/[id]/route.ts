import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";

// Get public recording by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordingId } = await params;

    // Get the recording using client-side Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Check if recording is public
    if (!recording?.isPublic) {
      return NextResponse.json(
        { error: "Recording is private" },
        { status: 401 }
      );
    }

    // Remove sensitive fields and return
    const publicRecording = {
      id: recording.id,
      title: recording.title,
      description: recording.description,
      duration: recording.duration,
      size: recording.size,
      width: recording.width,
      height: recording.height,
      format: recording.format,
      quality: recording.quality,
      fps: recording.fps,
      recordingType: recording.recordingType,
      hasAudio: recording.hasAudio,
      hasMicrophone: recording.hasMicrophone,
      thumbnail: recording.thumbnail,
      videoUrl: recording.videoUrl,
      cloudinaryPublicId: recording.cloudinaryPublicId,
      createdAt: recording.createdAt,
      isPublic: recording.isPublic,
      views: recording.views,
      tags: recording.tags || [],
      status: recording.status,
      // Don't include: userId, shareToken, or other sensitive data
    };

    return NextResponse.json(publicRecording);
  } catch (error) {
    console.error("Error fetching public recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
