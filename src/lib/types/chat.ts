export interface ChatMessage {
  id: string;
  recordingId: string;
  userId: string;
  userEmail: string;
  userDisplayName?: string;
  message: string;
  timestamp: number; // Unix timestamp
  createdAt: string; // ISO date string
}

export interface ChatUser {
  uid: string;
  email: string;
  displayName?: string;
  isOnline: boolean;
  lastSeen: number; // Unix timestamp
}

export interface ChatRoom {
  recordingId: string;
  recordingTitle: string;
  ownerId: string;
  isActive: boolean;
  activeUsers: { [userId: string]: ChatUser };
  messageCount: number;
  lastActivity: number; // Unix timestamp
  createdAt: string; // ISO date string
}

export interface SendMessageRequest {
  recordingId: string;
  message: string;
}

export interface ChatPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: number;
  userEmail: string;
  userDisplayName?: string;
}

// Real-time database structure
export interface ChatDatabaseStructure {
  chats: {
    [recordingId: string]: {
      messages: {
        [messageId: string]: ChatMessage;
      };
      presence: {
        [userId: string]: ChatPresence;
      };
      metadata: {
        recordingTitle: string;
        ownerId: string;
        messageCount: number;
        lastActivity: number;
        createdAt: string;
      };
    };
  };
}
