import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recordingId,
      recordingTitle,
      senderId,
      senderName,
      senderEmail,
      message,
    } = body;

    if (!recordingId || !senderId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(
      "🔔 API: Creating chat notifications for recording:",
      recordingId
    );

    // Get users who should receive notifications
    const recipients = await NotificationService.getNotificationRecipients(
      recordingId,
      senderId
    );

    if (recipients.length === 0) {
      console.log("📭 API: No recipients found for notifications");
      return NextResponse.json({ message: "No recipients found" });
    }

    // Create notifications for each recipient
    const notificationPromises = recipients.map(async (recipientId) => {
      return NotificationService.createNotification({
        recipientId,
        senderId,
        senderName,
        senderEmail,
        recordingId,
        recordingTitle,
        message:
          message.length > 100 ? message.substring(0, 100) + "..." : message,
        type: "chat_message",
      });
    });

    await Promise.all(notificationPromises);

    console.log(`✅ API: Created ${recipients.length} notifications`);

    return NextResponse.json({
      message: `Created ${recipients.length} notifications`,
      recipients: recipients.length,
    });
  } catch (error) {
    console.error("❌ API: Error creating chat notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
