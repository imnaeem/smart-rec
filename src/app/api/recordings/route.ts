import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { CloudinaryUploadService } from "@/lib/cloudinary/upload-service";

// Helper to verify user authentication using Firebase Admin
async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];

    // Use the properly configured Firebase Admin
    const { verifyIdToken } = await import("@/lib/firebase/admin");
    const decodedToken = await verifyIdToken(token);

    console.log("🔥 API: User authenticated:", decodedToken.uid);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      email_verified: decodedToken.emailVerified || false,
    };
  } catch (error) {
    console.error("🔥 AUTH: Auth verification error:", error);
    return null;
  }
}

// GET /api/recordings - Get user's recordings
export async function GET(request: NextRequest) {
  try {
    console.log("🔥 API: GET /api/recordings called");
    const user = await verifyAuth(request);

    if (!user) {
      console.log("🔥 API: Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔥 API: User authenticated:", user.uid);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    console.log(
      "🔥 API: Fetching recordings for user:",
      user.uid,
      "limit:",
      limit
    );

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 6000) // 6 second timeout
    );

    console.log("🔥 API: Calling RecordingService.getUserRecordings...");
    const recordingsPromise = RecordingService.getUserRecordings(
      user.uid,
      limit
    );

    try {
      const recordings = await Promise.race([
        recordingsPromise,
        timeoutPromise,
      ]);
      console.log(
        "🔥 API: Found recordings:",
        Array.isArray(recordings) ? recordings.length : 0
      );
      console.log("🔥 API: Returning recordings to client");
      return NextResponse.json({ recordings }, { status: 200 });
    } catch (firebaseError) {
      const errorMessage =
        firebaseError instanceof Error
          ? firebaseError.message
          : "Unknown error";
      console.error("🔥 API: Firebase error:", errorMessage);
      // Return empty array instead of failing
      console.log(
        "🔥 API: Returning empty recordings array due to Firebase error"
      );
      return NextResponse.json({ recordings: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("🔥 API: Get recordings error:", error);
    return NextResponse.json(
      { error: "Failed to get recordings" },
      { status: 500 }
    );
  }
}

// POST /api/recordings - Create new recording
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;
    const metadata = JSON.parse(formData.get("metadata") as string);

    // Validation
    if (!title || !file || !metadata) {
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

    // Check file size (max 100MB for free tier)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 400 }
      );
    }

    // Upload to Cloudinary first
    const cloudinaryResult = await CloudinaryUploadService.uploadVideoDirect(
      file,
      user.uid,
      {
        title,
        description,
        recordingType: metadata.recordingType,
        quality: metadata.quality,
        fps: metadata.fps,
        hasMicrophone: metadata.micEnabled,
        hasAudio: metadata.systemAudioEnabled,
      }
    );

    // Create recording in Firestore with Cloudinary URL
    const recordingData = {
      title,
      description,
      metadata,
      videoUrl: cloudinaryResult.secure_url,
      thumbnail: cloudinaryResult.thumbnail,
      duration: cloudinaryResult.duration,
      size: cloudinaryResult.bytes,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format,
      cloudinaryPublicId: cloudinaryResult.public_id,
      status: "ready",
    };

    console.log("🔥 API: Recording data to save:", recordingData);
    console.log("🔥 API: Thumbnail URL:", recordingData.thumbnail);

    const recordingId = await RecordingService.createRecordingWithCloudinary(
      user.uid,
      recordingData
    );

    return NextResponse.json(
      { recordingId, message: "Recording created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create recording error:", error);
    return NextResponse.json(
      { error: "Failed to create recording" },
      { status: 500 }
    );
  }
}
