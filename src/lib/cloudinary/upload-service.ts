import { cloudinary } from "./config";
import { Recording } from "@/lib/types/recording";
import { auth } from "@/lib/firebase/config";
import { v2 as cloudinaryV2, type UploadApiResponse } from "cloudinary";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  duration: number;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
  thumbnail: string;
}

export interface CloudinaryVideoInfo {
  url: string;
  duration: number;
  thumbnail: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export class CloudinaryUploadService {
  /**
   * Upload video to Cloudinary using server-side upload (for client-side calls)
   */
  static async uploadVideo(
    file: File | Buffer,
    userId: string,
    metadata: Partial<Recording>
  ): Promise<CloudinaryUploadResult> {
    try {
      // Create unique public ID
      const publicId = `smartrec-recordings/${userId}/${Date.now()}`;

      // Prepare form data for server-side upload
      const formData = new FormData();
      formData.append("file", file as any);
      formData.append("public_id", publicId);
      formData.append("folder", "smartrec-recordings");
      formData.append("resource_type", "video");
      formData.append("userId", userId);
      formData.append("metadata", JSON.stringify(metadata));

      // Get auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const authToken = await user.getIdToken();

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Generate thumbnail and get video info
      const videoInfo = await this.getVideoInfo(result.public_id);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: videoInfo.duration || result.duration || 0,
        width: videoInfo.width || result.width || 0,
        height: videoInfo.height || result.height || 0,
        format: videoInfo.format || result.format || "mp4",
        bytes: videoInfo.size || result.bytes || 0,
        created_at: result.created_at,
        thumbnail: videoInfo.thumbnail,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload video to Cloudinary");
    }
  }

  /**
   * Upload video to Cloudinary directly (for server-side calls)
   */
  static async uploadVideoDirect(
    file: File | Buffer,
    userId: string,
    metadata: Partial<Recording>
  ): Promise<CloudinaryUploadResult> {
    try {
      // Create unique public ID (without folder prefix since we use folder option)
      const publicId = `${userId}/${Date.now()}`;

      // This method will be called from server-side API routes
      // where we have direct access to Cloudinary SDK
      // Configure Cloudinary for server-side operations
      cloudinaryV2.config({
        cloud_name:
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
        secure: true,
      });

      // Upload options with thumbnail generation
      const uploadOptions = {
        public_id: publicId,
        folder: "smartrec-recordings",
        resource_type: "video" as const,
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
          // Thumbnail generation - use poster frame
          {
            width: 480,
            height: 270,
            crop: "fill",
            quality: "auto:good",
            fetch_format: "auto",
          },
        ],
        eager_async: true,
      };

      // Convert file to buffer if needed
      let buffer: Buffer;
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        buffer = Buffer.from(bytes);
      } else {
        buffer = file as Buffer;
      }

      // Upload to Cloudinary
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinaryV2.uploader
          .upload_stream(
            uploadOptions,
            (error: any, result: UploadApiResponse) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      });

      // Generate thumbnail URL using the eager transformation
      // The eager transformation should create a thumbnail at 1 second
      // Use the full public ID with folder prefix for thumbnail generation
      const fullPublicId = `smartrec-recordings/${publicId}`;
      let thumbnail = this.generateThumbnail(fullPublicId, {
        width: 480,
        height: 270,
        time: 1,
      });

      console.log("Generated thumbnail URL:", thumbnail);
      console.log("Public ID:", publicId);
      console.log("Upload result:", result);

      // Test if the thumbnail URL is accessible with retry mechanism
      let thumbnailAccessible = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!thumbnailAccessible && retryCount < maxRetries) {
        try {
          console.log(
            `🔥 CLOUDINARY: Testing thumbnail URL (attempt ${retryCount + 1}):`,
            thumbnail
          );
          const thumbnailResponse = await fetch(thumbnail, { method: "HEAD" });
          console.log(
            "🔥 CLOUDINARY: Thumbnail URL status:",
            thumbnailResponse.status
          );

          if (thumbnailResponse.ok) {
            thumbnailAccessible = true;
            console.log("🔥 CLOUDINARY: Thumbnail URL is accessible!");
          } else {
            console.warn(
              `🔥 CLOUDINARY: Thumbnail URL not accessible (attempt ${
                retryCount + 1
              }), trying alternative methods`
            );

            // Try alternative thumbnail URLs
            const altThumbnails = [
              `https://res.cloudinary.com/${
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff"
              }/video/upload/t_media_lib_thumb/${fullPublicId}`,
              `https://res.cloudinary.com/${
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff"
              }/video/upload/w_480,h_270,c_fill,q_auto/${fullPublicId}`,
              `https://res.cloudinary.com/${
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff"
              }/video/upload/w_480,h_270,c_fill,q_auto,f_jpg/${fullPublicId}.jpg`,
            ];

            for (const altThumb of altThumbnails) {
              try {
                const altResponse = await fetch(altThumb, { method: "HEAD" });
                if (altResponse.ok) {
                  console.log(
                    "🔥 CLOUDINARY: Found working thumbnail URL:",
                    altThumb
                  );
                  thumbnail = altThumb;
                  thumbnailAccessible = true;
                  break;
                }
              } catch (error) {
                console.log(
                  "🔥 CLOUDINARY: Alternative thumbnail not accessible:",
                  altThumb
                );
              }
            }
          }
        } catch (error) {
          console.error("🔥 CLOUDINARY: Error testing thumbnail URL:", error);
        }

        if (!thumbnailAccessible && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(
            `🔥 CLOUDINARY: Waiting 2 seconds before retry ${retryCount + 1}...`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        } else {
          retryCount++;
        }
      }

      if (!thumbnailAccessible) {
        console.warn(
          "🔥 CLOUDINARY: Could not find accessible thumbnail URL after all retries"
        );
      }

      const uploadResult = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration || 0,
        width: result.width || 0,
        height: result.height || 0,
        format: result.format || "mp4",
        bytes: result.bytes || 0,
        created_at: result.created_at,
        thumbnail,
      };

      console.log("🔥 CLOUDINARY: Final upload result:", uploadResult);
      console.log("🔥 CLOUDINARY: Thumbnail URL:", uploadResult.thumbnail);

      return uploadResult;
    } catch (error) {
      console.error("Cloudinary direct upload error:", error);
      throw new Error("Failed to upload video to Cloudinary");
    }
  }

  /**
   * Get video information from Cloudinary
   */
  static async getVideoInfo(publicId: string): Promise<CloudinaryVideoInfo> {
    try {
      const result = await cloudinaryV2.api.resource(publicId, {
        resource_type: "video",
      });

      // Generate thumbnail URL
      const thumbnailUrl = cloudinaryV2.url(publicId, {
        resource_type: "video",
        transformation: [
          { width: 320, height: 180, crop: "fill" },
          { quality: "auto:good" },
        ],
      });

      return {
        url: result.secure_url,
        duration: result.duration || 0,
        thumbnail: thumbnailUrl,
        width: result.width || 0,
        height: result.height || 0,
        format: result.format || "mp4",
        size: result.bytes || 0,
      };
    } catch (error) {
      console.error("Cloudinary get video info error:", error);
      throw new Error("Failed to get video information");
    }
  }

  /**
   * Delete video from Cloudinary
   */
  static async deleteVideo(publicId: string): Promise<void> {
    try {
      console.log("🔥 CLOUDINARY: Attempting to delete video:", publicId);

      // Ensure Cloudinary is configured
      cloudinaryV2.config({
        cloud_name:
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
        secure: true,
      });

      const result = await cloudinaryV2.uploader.destroy(publicId, {
        resource_type: "video",
      });

      console.log("🔥 CLOUDINARY: Delete result:", result);

      if (result.result === "ok") {
        console.log("🔥 CLOUDINARY: Successfully deleted video:", publicId);
      } else {
        console.warn("🔥 CLOUDINARY: Unexpected delete result:", result);
      }
    } catch (error) {
      console.error("🔥 CLOUDINARY: Delete error:", error);
      throw new Error(
        `Failed to delete video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate video thumbnail from Cloudinary
   */
  static generateThumbnail(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      time?: number;
    } = {}
  ): string {
    const { width = 320, height = 180, time = 0 } = options;

    // Use Cloudinary's proper thumbnail generation approach
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxesjeff";

    try {
      // Method 1: Use media_lib_thumb transformation (Cloudinary's default thumbnail)
      const mediaLibThumbUrl = `https://res.cloudinary.com/${cloudName}/video/upload/t_media_lib_thumb/${publicId}`;

      // Method 2: Use custom transformation with offset (preferred)
      const customThumbUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill,so_${time},q_auto,f_auto/${publicId}`;

      // Method 3: Use poster frame (first frame)
      const posterUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill,q_auto/${publicId}`;

      // Method 4: Use jpg extension (Cloudinary's recommended approach)
      const jpgThumbUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill,q_auto,f_jpg/${publicId}.jpg`;

      // Method 5: Use poster frame with jpg (most reliable for your cloud)
      const posterJpgUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill,q_auto,f_jpg/${publicId}.jpg`;

      console.log("Generated thumbnail URLs:");
      console.log("Media lib thumb:", mediaLibThumbUrl);
      console.log("Custom thumb:", customThumbUrl);
      console.log("Poster:", posterUrl);
      console.log("JPG thumb:", jpgThumbUrl);
      console.log("Poster JPG:", posterJpgUrl);

      // Return the poster JPG URL as primary choice (works with your cloud)
      return posterJpgUrl;
    } catch (error) {
      console.error("Error generating thumbnail URL:", error);

      // Fallback: Use a simple poster frame
      const fallbackUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill,q_auto/${publicId}`;
      console.log("Using fallback thumbnail URL:", fallbackUrl);
      return fallbackUrl;
    }
  }

  /**
   * Create edited video (trimmed version)
   */
  static async createEditedVideo(
    originalPublicId: string,
    startTime: number,
    endTime: number,
    userId: string
  ): Promise<CloudinaryUploadResult> {
    try {
      const duration = endTime - startTime;
      const newPublicId = `smartrec-recordings/${userId}/edited_${Date.now()}`;

      // Create transformation for trimming
      const transformation = [
        { start_offset: startTime },
        { end_offset: endTime },
        { quality: "auto:good" },
      ];

      // Create the edited video
      const result = await cloudinaryV2.uploader.explicit(originalPublicId, {
        type: "upload",
        resource_type: "video",
        public_id: newPublicId,
        transformation,
        context: {
          userId,
          originalVideo: originalPublicId,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          duration: duration.toString(),
          type: "edited",
        },
        tags: ["smartrec", "recording", "edited", userId],
      });

      // Generate thumbnail for edited video
      const thumbnail = this.generateThumbnail(result.public_id, {
        width: 480,
        height: 270,
        time: 1,
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration || duration,
        width: result.width || 0,
        height: result.height || 0,
        format: result.format || "mp4",
        bytes: result.bytes || 0,
        created_at: result.created_at,
        thumbnail,
      };
    } catch (error) {
      console.error("Cloudinary edit video error:", error);
      throw new Error("Failed to create edited video");
    }
  }

  /**
   * Get user's videos from Cloudinary
   */
  static async getUserVideos(
    userId: string,
    limit: number = 20
  ): Promise<CloudinaryVideoInfo[]> {
    try {
      // For now, return empty array since we're using Firebase for metadata
      // In the future, we can implement Cloudinary API calls here
      return [];
    } catch (error) {
      console.error("Cloudinary get user videos error:", error);
      throw new Error("Failed to get user videos");
    }
  }
}
