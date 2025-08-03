import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyIdToken } from "@/lib/firebase/admin";

// Configure Cloudinary for server-side operations
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

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
    const file = formData.get("file") as File;
    const publicId = formData.get("public_id") as string;
    const folder = formData.get("folder") as string;
    const resourceType = formData.get("resource_type") as string;
    const metadata = JSON.parse(formData.get("metadata") as string);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload options with thumbnail generation
    const uploadOptions = {
      public_id: publicId,
      folder: folder,
      resource_type: resourceType as "video",
      context: {
        userId,
        title: metadata.title || "Untitled Recording",
        description: metadata.description || "",
        recordingType: metadata.recordingType || "screen",
        quality: metadata.quality || "720p",
        fps: metadata.fps || 30,
      },
      tags: ["smartrec", "recording", userId],
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      eager: [
        // Optimized video versions
        { width: 1280, height: 720, crop: "scale", quality: "auto:good" },
        { width: 854, height: 480, crop: "scale", quality: "auto:good" },
        // Thumbnail generation
        {
          width: 480,
          height: 270,
          crop: "fill",
          quality: "auto:good",
          offset: 1, // Take thumbnail at 1 second
          fetch_format: "auto",
        },
      ],
      eager_async: true,
    };

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(buffer);
    });

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
