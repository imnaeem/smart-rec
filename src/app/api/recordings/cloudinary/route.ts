import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";
import { CloudinaryUploadService } from "@/lib/cloudinary/upload-service";
import { RecordingService } from "@/lib/firebase/recordings";

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
    const recordingType = formData.get("recordingType") as string;
    const quality = formData.get("quality") as string;
    const fps = parseInt(formData.get("fps") as string) || 30;
    const hasMicrophone = formData.get("hasMicrophone") === "true";
    const hasAudio = formData.get("hasAudio") === "true";
    const file = formData.get("file") as File;

    // Validate required fields
    if (!title || !file) {
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

    // Upload to Cloudinary
    const cloudinaryResult = await CloudinaryUploadService.uploadVideo(
      file,
      userId,
      {
        title,
        description,
        recordingType: recordingType as "screen" | "window" | "tab",
        quality: quality as "720p" | "1080p" | "4k",
        fps,
        hasMicrophone,
        hasAudio,
      }
    );

    // Create recording metadata
    const metadata = {
      recordingType: recordingType || "screen",
      micEnabled: hasMicrophone,
      systemAudioEnabled: hasAudio,
      quality: quality || "720p",
      fps,
    };

    // Create recording in Firestore
    const recordingData = {
      title,
      description: description || "",
      metadata,
      videoUrl: cloudinaryResult.secure_url,
      thumbnail: CloudinaryUploadService.generateThumbnail(
        cloudinaryResult.public_id
      ),
      duration: cloudinaryResult.duration,
      size: cloudinaryResult.bytes,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format,
      cloudinaryPublicId: cloudinaryResult.public_id,
      status: "ready",
    };

    const recordingId = await RecordingService.createRecording(
      userId,
      recordingData as any
    );

    return NextResponse.json(
      {
        recordingId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        videoUrl: cloudinaryResult.secure_url,
        thumbnail: recordingData.thumbnail,
        duration: cloudinaryResult.duration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get recordings from Firestore (Cloudinary URLs are stored in Firebase)
    const recordings = await RecordingService.getUserRecordings(userId, limit);

    return NextResponse.json({ recordings });
  } catch (error) {
    console.error("Error fetching Cloudinary recordings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}
