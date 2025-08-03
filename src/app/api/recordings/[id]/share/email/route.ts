import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";

// Add email to recording share list
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For local development, use mock user
    const mockUser = {
      uid: "dev_user_123",
      email: "dev@example.com",
    };

    const { email } = await request.json();
    const recordingId = params.id;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get the recording to verify ownership using client-side Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    if (recording?.userId !== mockUser.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sharing recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove email from recording share list
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For local development, use mock user
    const mockUser = {
      uid: "dev_user_123",
      email: "dev@example.com",
    };

    const { email } = await request.json();
    const recordingId = params.id;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get the recording to verify ownership using client-side Firebase
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    if (recording?.userId !== mockUser.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
