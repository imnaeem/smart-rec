"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./auth-context";
import { NotificationService } from "@/lib/services/notification-service";
import type { Notification } from "@/lib/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  setCurrentVideo: (videoId: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    console.log(
      "🔔 NOTIFICATION: Setting up real-time listener for user:",
      user.uid
    );

    const unsubscribe = NotificationService.subscribeToNotifications(
      user.uid,
      (newNotifications) => {
        console.log(
          "🔔 NOTIFICATION: Received notifications:",
          newNotifications.length
        );
        setNotifications(newNotifications);
        setIsLoading(false);
      }
    );

    return () => {
      console.log("🔔 NOTIFICATION: Cleaning up listener");
      unsubscribe();
    };
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);

      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter((n) => !n.isRead);

      await Promise.all(
        unreadNotifications.map((n) => NotificationService.markAsRead(n.id))
      );

      // Optimistically update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [notifications]);

  // Filter out notifications for currently open video
  const filteredNotifications = notifications.filter(
    (n) => !currentVideoId || n.recordingId !== currentVideoId
  );

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const setCurrentVideo = useCallback(
    (videoId: string | null) => {
      setCurrentVideoId(videoId);

      // Auto-mark notifications as read for the opened video
      if (videoId) {
        const videoNotifications = notifications.filter(
          (n) => n.recordingId === videoId && !n.isRead
        );

        videoNotifications.forEach((notification) => {
          markAsRead(notification.id);
        });
      }
    },
    [notifications, markAsRead]
  );

  const value = {
    notifications: filteredNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    setCurrentVideo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return noop functions for public views where NotificationProvider is not available
    return {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      markAllAsRead: () => {},
      isLoading: false,
      setCurrentVideo: () => {},
    };
  }
  return context;
}
