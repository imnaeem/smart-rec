import { useState, useEffect, useCallback, useRef } from "react";
import {
  ref,
  push,
  onValue,
  off,
  set,
  onDisconnect,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { realtimeDb } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import type {
  ChatMessage,
  ChatPresence,
  SendMessageRequest,
} from "@/lib/types/chat";

interface UseVideoChatProps {
  recordingId: string;
  recordingTitle: string;
  isEnabled: boolean;
}

interface UseVideoChatReturn {
  messages: ChatMessage[];
  onlineUsers: ChatPresence[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  messageCount: number;
}

export function useVideoChat({
  recordingId,
  recordingTitle,
  isEnabled,
}: UseVideoChatProps): UseVideoChatReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  const messagesRef = useRef<any>(null);
  const presenceRef = useRef<any>(null);
  const userPresenceRef = useRef<any>(null);

  // Setup user presence
  const setupPresence = useCallback(async () => {
    if (!user || !isEnabled) return;

    try {
      const presenceData: ChatPresence = {
        userId: user.uid,
        isOnline: true,
        lastSeen: Date.now(),
        userEmail: user.email || "",
        userDisplayName: user.displayName || undefined,
      };

      const userPresenceRef = ref(
        realtimeDb,
        `chats/${recordingId}/presence/${user.uid}`
      );

      // Set user as online
      await set(userPresenceRef, presenceData);

      // Set user as offline when they disconnect
      onDisconnect(userPresenceRef).set({
        ...presenceData,
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error setting up presence:", err);
      setError("Failed to setup chat presence");
    }
  }, [user, recordingId, isEnabled]);

  // Listen to presence changes
  useEffect(() => {
    if (!recordingId || !isEnabled) return;

    const presenceRefPath = ref(realtimeDb, `chats/${recordingId}/presence`);
    presenceRef.current = presenceRefPath;

    const unsubscribe = onValue(presenceRefPath, (snapshot) => {
      const presenceData = snapshot.val();
      if (presenceData) {
        const users = Object.values(presenceData) as ChatPresence[];
        setOnlineUsers(users.filter((u) => u.isOnline));
      } else {
        setOnlineUsers([]);
      }
    });

    return () => {
      if (presenceRef.current) {
        off(presenceRef.current, "value", unsubscribe);
      }
    };
  }, [recordingId, isEnabled]);

  // Listen to messages
  useEffect(() => {
    if (!recordingId || !isEnabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Listen to last 50 messages ordered by timestamp
    const messagesRefPath = ref(realtimeDb, `chats/${recordingId}/messages`);
    const messagesQuery = query(
      messagesRefPath,
      orderByChild("timestamp"),
      limitToLast(50)
    );
    messagesRef.current = messagesQuery;

    const unsubscribe = onValue(
      messagesQuery,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const messagesArray = Object.keys(data)
              .map((key) => ({ ...data[key], id: key }))
              .sort((a, b) => a.timestamp - b.timestamp);

            setMessages(messagesArray);
            setMessageCount(messagesArray.length);
          } else {
            setMessages([]);
            setMessageCount(0);
          }
          setIsLoading(false);
        } catch (err) {
          console.error("Error processing messages:", err);
          setError("Failed to load chat messages");
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to connect to chat");
        setIsLoading(false);
      }
    );

    return () => {
      if (messagesRef.current) {
        off(messagesRef.current, "value", unsubscribe);
      }
    };
  }, [recordingId, isEnabled]);

  // Setup presence when component mounts
  useEffect(() => {
    if (isEnabled) {
      setupPresence();
    }
  }, [setupPresence, isEnabled]);

  // Cleanup presence on unmount
  useEffect(() => {
    return () => {
      if (user && recordingId && userPresenceRef.current) {
        set(userPresenceRef.current, {
          userId: user.uid,
          isOnline: false,
          lastSeen: Date.now(),
          userEmail: user.email || "",
          userDisplayName: user.displayName || undefined,
        });
      }
    };
  }, [user, recordingId]);

  // Send message function
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!user || !recordingId || !messageText.trim()) {
        throw new Error("Invalid message or user not authenticated");
      }

      try {
        const messagesRefPath = ref(
          realtimeDb,
          `chats/${recordingId}/messages`
        );
        const messageData: Omit<ChatMessage, "id"> = {
          recordingId,
          userId: user.uid,
          userEmail: user.email || "",
          userDisplayName: user.displayName || undefined,
          message: messageText.trim(),
          timestamp: Date.now(),
          createdAt: new Date().toISOString(),
        };

        // Push message to Firebase
        await push(messagesRefPath, messageData);

        // Update chat metadata
        const metadataRef = ref(realtimeDb, `chats/${recordingId}/metadata`);
        await set(metadataRef, {
          recordingTitle,
          ownerId: user.uid, // This could be the recording owner, but using current user for now
          messageCount: messageCount + 1,
          lastActivity: Date.now(),
          createdAt: new Date().toISOString(),
        });

        // Create notifications for other users
        try {
          const response = await fetch(`/api/notifications/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recordingId,
              recordingTitle,
              senderId: user.uid,
              senderName: user.displayName || user.email || "Someone",
              senderEmail: user.email || "",
              message: messageText.trim(),
            }),
          });

          if (!response.ok) {
            console.warn(
              "Failed to create chat notifications:",
              await response.text()
            );
          }
        } catch (notificationError) {
          console.warn("Error creating chat notifications:", notificationError);
          // Don't fail the message sending if notifications fail
        }
      } catch (err) {
        console.error("Error sending message:", err);
        throw new Error("Failed to send message");
      }
    },
    [user, recordingId, recordingTitle, messageCount]
  );

  return {
    messages,
    onlineUsers,
    isLoading,
    error,
    sendMessage,
    messageCount,
  };
}
