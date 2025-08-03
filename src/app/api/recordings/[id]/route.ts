import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";
import { ShareService } from "@/lib/services/share-service";
import { verifyIdToken } from "@/lib/firebase/admin";
import { v2 as cloudinary } from "cloudinary";

// Helper to verify user authentication
async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];

    // For development, use a simple token check
    if (process.env.NODE_ENV === "development") {
      // In development, accept any non-empty token
      if (token && token.length > 10) {
        return {
          uid: "dev_user_123",
          email: "dev@example.com",
          emailVerified: true,
        };
      }
    }

    const user = await verifyIdToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/recordings/[id] - Get specific recording
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordingId } = await params;
    const recording = await RecordingService.getRecording(recordingId);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    const user = await verifyAuth(request);
    let hasAccess = false;

    if (recording.isPublic) {
      // Public recordings are accessible to everyone
      hasAccess = true;
    } else if (user) {
      // For private recordings, check if user is owner or has shared access
      if (user.uid === recording.userId) {
        hasAccess = true;
      } else {
        // Check if recording is shared with this user
        hasAccess = await ShareService.verifyEmailAccess(
          recordingId,
          user.uid,
          user.email
        );
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Increment view count (non-blocking)
    RecordingService.incrementViews(recordingId).catch(console.error);

    return NextResponse.json({ recording }, { status: 200 });
  } catch (error) {
    console.error("Get recording error:", error);
    return NextResponse.json(
      { error: "Failed to get recording" },
      { status: 500 }
    );
  }
}

// PUT /api/recordings/[id] - Update recording
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recordingId } = await params;
    const updates = await request.json();

    // Validate updates
    const allowedFields = ["title", "description", "isPublic", "tags"];
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    await RecordingService.updateRecording(
      recordingId,
      user.uid,
      sanitizedUpdates
    );

    return NextResponse.json(
      { message: "Recording updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update recording error:", error);
    return NextResponse.json(
      { error: "Failed to update recording" },
      { status: 500 }
    );
  }
}

// DELETE /api/recordings/[id] - Delete recording
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recordingId } = await params;

    // Get recording data first to check for Cloudinary public ID
    const recording = await RecordingService.getRecording(recordingId);
    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    // In development mode, allow any authenticated user to delete any recording
    if (process.env.NODE_ENV === "development") {
    } else if (recording.userId !== user.uid) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete from Cloudinary if cloudinaryPublicId exists
    if (recording.cloudinaryPublicId) {
      try {
        const { CloudinaryUploadService } = await import(
          "@/lib/cloudinary/upload-service"
        );

        // Configure Cloudinary for server-side operations
        const cloudinaryV2 = cloudinary;
        cloudinaryV2.config({
          cloud_name:
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff",
          api_key: process.env.CLOUDINARY_API_KEY || "",
          api_secret: process.env.CLOUDINARY_API_SECRET || "",
          secure: true,
        });

        await CloudinaryUploadService.deleteVideo(recording.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error(
          "🔥 API: Failed to delete from Cloudinary:",
          cloudinaryError
        );
        // Continue with Firebase deletion even if Cloudinary fails
      }
    }

    // Delete from Firebase (storage and database)
    await RecordingService.deleteRecording(recordingId, user.uid);

    return NextResponse.json(
      { message: "Recording deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete recording error:", error);
    return NextResponse.json(
      { error: "Failed to delete recording" },
      { status: 500 }
    );
  }
}
