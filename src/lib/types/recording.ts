export interface Recording {
  id: string;
  userId: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  size: number; // in bytes
  width?: number; // video width
  height?: number; // video height
  format: "mp4" | "webm";
  quality: "720p" | "1080p" | "4k";
  fps: number;
  recordingType: "screen" | "window" | "tab";
  hasAudio: boolean;
  hasMicrophone: boolean;
  thumbnail?: string; // URL to thumbnail image
  videoUrl: string; // Firebase Storage URL
  cloudinaryPublicId?: string; // Cloudinary public ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isPublic: boolean;
  views: number;
  shareToken?: string; // For public sharing
  tags: string[];
  transcription?: string; // AI-generated transcription
  status: "processing" | "ready" | "failed";
  originalRecordingId?: string; // For edited videos
  editInfo?: {
    startTime: number;
    endTime: number;
    originalDuration: number;
  };
  // Sharing information
  sharedWith?: SharedUser[]; // Only populated for shared recordings
  sharedBy?: SharedUser; // Information about who shared it (for shared recordings)
  sharedAt?: string; // When it was shared with current user
}

export interface SharedUser {
  uid: string;
  email: string;
  displayName?: string;
  sharedAt: string; // ISO date string
}

export interface RecordingMetadata {
  recordingType: "screen" | "window" | "tab";
  micEnabled: boolean;
  systemAudioEnabled: boolean;
  quality: "720p" | "1080p" | "4k";
  fps: number;
}

export interface RecordingSession {
  id: string;
  userId: string;
  startedAt: string;
  isActive: boolean;
  metadata: RecordingMetadata;
}

export interface CreateRecordingRequest {
  title: string;
  description?: string;
  metadata: RecordingMetadata;
  file: File;
  originalRecordingId?: string;
  editInfo?: {
    startTime: number;
    endTime: number;
    originalDuration: number;
  };
  cloudinaryPublicId?: string;
}

export interface UpdateRecordingRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
  shareToken?: string | null;
  updatedAt?: string;
  tags?: string[];
}

// New schema for sharedRecordings collection
export interface SharedRecording {
  id: string; // Auto-generated Firestore document ID
  recordingId: string; // Reference to the recording
  ownerUid: string; // Who owns the recording
  ownerEmail: string; // Owner's email for reference
  ownerDisplayName?: string; // Owner's display name
  sharedWithUid?: string; // User ID of person it's shared with (null for public shares)
  sharedWithEmail: string; // Email of person it's shared with ("public" for public shares)
  shareType: "email" | "public"; // Type of share
  shareToken?: string; // Optional token for public links
  permissions: {
    canView: boolean; // Always true for basic shares
    canDownload?: boolean; // Future feature
    canComment?: boolean; // Future feature
  };
  createdAt: string; // When the share was created
  expiresAt?: string; // Optional expiration (future feature)
  isActive: boolean; // Can be disabled without deleting
  recordingTitle: string; // Cached for easy display
}
