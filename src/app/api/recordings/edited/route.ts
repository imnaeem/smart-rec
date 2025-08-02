import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { verifyIdToken } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    // Parse form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalRecordingId = formData.get("originalRecordingId") as string;
    const startTime = parseFloat(formData.get("startTime") as string);
    const endTime = parseFloat(formData.get("endTime") as string);
    const file = formData.get("file") as File;

    // Validate required fields
    if (!title || !file || !originalRecordingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only video files are allowed." },
        { status: 400 }
      );
    }

    // Get original recording to copy metadata
    const originalRecording = await RecordingService.getRecording(
      originalRecordingId
    );
    if (!originalRecording || originalRecording.userId !== userId) {
      return NextResponse.json(
        { error: "Original recording not found or access denied" },
        { status: 404 }
      );
    }

    // Create metadata for edited video
    const metadata = {
      recordingType: originalRecording.recordingType,
      micEnabled: originalRecording.hasMicrophone,
      systemAudioEnabled: originalRecording.hasAudio,
      quality: originalRecording.quality,
      fps: originalRecording.fps,
    };

    // Create recording data
    const recordingData = {
      title: title,
      description:
        description || `Edited version of "${originalRecording.title}"`,
      metadata: metadata,
      file: file,
      originalRecordingId: originalRecordingId,
      editInfo: {
        startTime: startTime,
        endTime: endTime,
        originalDuration: originalRecording.duration,
      },
    };

    // Create the edited recording
    const recordingId = await RecordingService.createRecording(
      userId,
      recordingData
    );

    return NextResponse.json({ recordingId }, { status: 201 });
  } catch (error) {
    console.error("Error creating edited recording:", error);
    return NextResponse.json(
      { error: "Failed to create edited recording" },
      { status: 500 }
    );
  }
}
