"use client";

import { useEffect, useCallback } from "react";
import type { RecordingMetadata } from "@/lib/types/recording";

interface RecordingSession {
  id: string;
  startTime: number;
  metadata: RecordingMetadata;
  title?: string;
}

const RECORDING_SESSION_KEY = "smart_rec_active_recording";

export function useRecordingPersistence() {
  // Save recording session to localStorage
  const saveRecordingSession = useCallback(
    (sessionId: string, metadata: RecordingMetadata, title?: string) => {
      const session: RecordingSession = {
        id: sessionId,
        startTime: Date.now(),
        metadata,
        title,
      };
      localStorage.setItem(RECORDING_SESSION_KEY, JSON.stringify(session));

      // Update page title to show recording indicator
      document.title = "🔴 Recording... - SmartRec";
    },
    []
  );

  // Clear recording session
  const clearRecordingSession = useCallback(() => {
    localStorage.removeItem(RECORDING_SESSION_KEY);

    // Reset page title
    document.title = "SmartRec";
  }, []);

  // Get active recording session
  const getActiveRecordingSession = useCallback((): RecordingSession | null => {
    try {
      const stored = localStorage.getItem(RECORDING_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Set up beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const activeSession = getActiveRecordingSession();
      if (activeSession) {
        e.preventDefault();
        e.returnValue =
          "You have an active recording. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [getActiveRecordingSession]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const activeSession = getActiveRecordingSession();
      if (activeSession) {
        if (document.hidden) {
          // Page is hidden, but recording continues
          document.title = "🔴 Recording (Background) - SmartRec";
        } else {
          // Page is visible again
          document.title = "🔴 Recording... - SmartRec";
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [getActiveRecordingSession]);

  // Check for active recordings on mount
  useEffect(() => {
    const activeSession = getActiveRecordingSession();
    if (activeSession) {
      document.title = "🔴 Recording... - SmartRec";
    }
  }, [getActiveRecordingSession]);

  return {
    saveRecordingSession,
    clearRecordingSession,
    getActiveRecordingSession,
  };
}
