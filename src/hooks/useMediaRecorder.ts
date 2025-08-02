"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { RecordingMetadata } from "@/lib/types/recording";
import { useRecordingPersistence } from "./useRecordingPersistence";

interface UseMediaRecorderOptions {
  metadata: RecordingMetadata;
  onRecordingComplete?: (blob: Blob, duration: number) => void;
  onError?: (error: Error) => void;
}

interface MediaRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  error: string | null;
  recordedBlob: Blob | null;
}

export function useMediaRecorder({
  metadata,
  onRecordingComplete,
  onError,
}: UseMediaRecorderOptions) {
  const [state, setState] = useState<MediaRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    error: null,
    recordedBlob: null,
  });

  const {
    saveRecordingSession,
    clearRecordingSession,
    getActiveRecordingSession,
  } = useRecordingPersistence();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const updateTimer = useCallback(() => {
    if (startTimeRef.current && !state.isPaused) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setState((prev) => ({ ...prev, recordingTime: elapsed }));
    }
  }, [state.isPaused]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(updateTimer, 1000);
  }, [updateTimer]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getDisplayMedia = useCallback(async (): Promise<MediaStream> => {
    const constraints: DisplayMediaStreamConstraints = {
      video: {
        width: {
          ideal:
            metadata.quality === "4k"
              ? 3840
              : metadata.quality === "1080p"
              ? 1920
              : 1280,
        },
        height: {
          ideal:
            metadata.quality === "4k"
              ? 2160
              : metadata.quality === "1080p"
              ? 1080
              : 720,
        },
        frameRate: { ideal: metadata.fps },
      },
      audio: metadata.systemAudioEnabled,
    };

    return navigator.mediaDevices.getDisplayMedia(constraints);
  }, [metadata]);

  const getUserMedia = useCallback(async (): Promise<MediaStream | null> => {
    if (!metadata.micEnabled) return null;

    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (error) {
      console.warn("Failed to get microphone access:", error);
      return null;
    }
  }, [metadata.micEnabled]);

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      // Check browser support
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("Screen recording is not supported in this browser");
      }

      // Generate session ID and save to localStorage
      const sessionId = `recording_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}`;
      sessionIdRef.current = sessionId;
      saveRecordingSession(sessionId, metadata);

      // Get display media stream with better error handling
      let displayStream: MediaStream;
      try {
        displayStream = await getDisplayMedia();
        streamRef.current = displayStream;
      } catch (permissionError) {
        // Handle permission denied gracefully
        clearRecordingSession();
        if (permissionError instanceof Error) {
          if (permissionError.name === "NotAllowedError") {
            throw new Error(
              "Screen recording permission was denied. Please allow screen sharing to continue."
            );
          } else if (permissionError.name === "AbortError") {
            throw new Error(
              "Screen recording was cancelled. Click 'Start Recording' to try again."
            );
          } else {
            throw new Error(
              `Screen recording failed: ${permissionError.message}`
            );
          }
        }
        throw new Error("Screen recording permission was denied or cancelled.");
      }

      // Get microphone stream if enabled
      let micStream: MediaStream | null = null;
      if (metadata.micEnabled) {
        try {
          micStream = await getUserMedia();
        } catch (micError) {
          // Don't fail the entire recording if mic access is denied
          console.warn(
            "Microphone access denied, continuing without microphone:",
            micError
          );
          // Note: We continue without throwing an error here
        }
      }

      // Check if system audio is actually available
      const hasSystemAudio = displayStream.getAudioTracks().length > 0;
      if (metadata.systemAudioEnabled && !hasSystemAudio) {
        console.warn("System audio was requested but not available");
      }

      // Combine streams if needed
      let finalStream = displayStream;
      if (micStream) {
        // Create a new MediaStream combining both
        finalStream = new MediaStream([
          ...displayStream.getTracks(),
          ...micStream.getTracks(),
        ]);
      }

      // Set up MediaRecorder with better codec support
      let mimeType = "video/webm"; // Default fallback

      // Check if we have audio tracks to determine codec preferences
      const hasAudio = finalStream.getAudioTracks().length > 0;

      // Try different MIME types in order of preference
      const preferredMimeTypes = hasAudio
        ? [
            // Audio-video combinations for when audio is present
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm;codecs=h264,opus",
            "video/mp4;codecs=h264,aac",
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp8",
            "video/webm",
            "video/mp4",
          ]
        : [
            // Video-only codecs when no audio
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp8",
            "video/mp4;codecs=h264",
            "video/webm",
            "video/mp4",
          ];

      for (const type of preferredMimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const recorder = new MediaRecorder(finalStream, {
        mimeType,
        videoBitsPerSecond:
          metadata.quality === "4k"
            ? 8000000
            : metadata.quality === "1080p"
            ? 5000000
            : 2500000,
      });

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const duration = state.recordingTime;

        // Clear recording session from localStorage
        clearRecordingSession();

        setState((prev) => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
          isPaused: false,
        }));

        if (onRecordingComplete) {
          onRecordingComplete(blob, duration);
        }

        // Clean up streams
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (micStream) {
          micStream.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.onerror = (event) => {
        const error = new Error(`Recording failed: ${event.error}`);
        setState((prev) => ({ ...prev, error: error.message }));
        if (onError) onError(error);
      };

      // Handle stream ending (user stops sharing)
      displayStream.getVideoTracks()[0].addEventListener("ended", () => {
        if (mediaRecorderRef.current && state.isRecording) {
          stopRecording();
        }
      });

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Collect data every second

      setState((prev) => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
      }));

      startTimer();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start recording";
      setState((prev) => ({ ...prev, error: errorMessage }));
      if (onError)
        onError(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    metadata,
    getDisplayMedia,
    getUserMedia,
    onRecordingComplete,
    onError,
    startTimer,
    state.isRecording,
    state.recordingTime,
  ]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      stopTimer();
      // Session will be cleared in onstop handler
    }
  }, [state.isRecording, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      if (state.isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setState((prev) => ({ ...prev, isPaused: false }));
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setState((prev) => ({ ...prev, isPaused: true }));
      }
    }
  }, [state.isRecording, state.isPaused, startTimer, stopTimer]);

  // Check for active recording on mount
  useEffect(() => {
    const activeSession = getActiveRecordingSession();
    if (activeSession && !state.isRecording) {
      // There's an active recording session but we're not currently recording
      // This means the page was reloaded during recording
      setState((prev) => ({
        ...prev,
        error:
          "Recording session was interrupted. Please start a new recording.",
      }));
      clearRecordingSession();
    }
  }, [getActiveRecordingSession, clearRecordingSession, state.isRecording]);

  // Check if we're in a browser environment
  const isBrowser =
    typeof window !== "undefined" && typeof navigator !== "undefined";

  return {
    ...state,
    formattedTime: formatTime(state.recordingTime),
    startRecording,
    stopRecording,
    pauseRecording,
    isSupported: isBrowser && !!navigator.mediaDevices?.getDisplayMedia,
  };
}
