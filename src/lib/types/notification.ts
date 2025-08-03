export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recordingId: string;
  recordingTitle: string;
  message: string;
  type: "chat_message";
  isRead: boolean;
  createdAt: string;
  timestamp: number;
}

export interface CreateNotificationData {
  recipientId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recordingId: string;
  recordingTitle: string;
  message: string;
  type: "chat_message";
}
