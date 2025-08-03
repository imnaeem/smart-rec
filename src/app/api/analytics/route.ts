import { NextRequest, NextResponse } from "next/server";
import { RecordingService } from "@/lib/firebase/recordings";

// Helper to verify user authentication using Firebase Admin
async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];

    // Use the properly configured Firebase Admin
    const { verifyIdToken } = await import("@/lib/firebase/admin");
    const decodedToken = await verifyIdToken(token);

    console.log("🔥 API: User authenticated for analytics:", decodedToken.uid);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      email_verified: decodedToken.emailVerified || false,
    };
  } catch (error) {
    console.error("🔥 AUTH: Auth verification error:", error);
    return null;
  }
}

// Get analytics data for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔥 API: Getting analytics for user:", user.uid);

    // Get user's recordings using client-side Firebase
    const recordings = await RecordingService.getUserRecordings(user.uid, 100);

    // Calculate basic analytics
    const totalRecordings = recordings.length;
    const totalViews = recordings.reduce(
      (sum, recording) => sum + (recording.views || 0),
      0
    );
    const totalDuration = recordings.reduce(
      (sum, recording) => sum + (recording.duration || 0),
      0
    );
    const totalSize = recordings.reduce(
      (sum, recording) => sum + (recording.size || 0),
      0
    );

    // Views over time (last 30 days) - show actual user activity only
    const viewsTimeline = [];

    // Initialize all days with 0 views
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      viewsTimeline.push({
        date: dateStr,
        views: 0,
      });
    }

    // Add actual views for days when recordings were created
    recordings.forEach((recording) => {
      const recordingDate = new Date(recording.createdAt);
      const recordingDateStr = recordingDate.toISOString().split("T")[0];

      // Find the matching day in our timeline
      const timelineDay = viewsTimeline.find(
        (day) => day.date === recordingDateStr
      );
      if (timelineDay) {
        // Add this recording's views to that day
        timelineDay.views += recording.views || 0;
      }
    });

    // Recordings by quality
    const qualityStats = recordings.reduce(
      (stats: Record<string, number>, recording) => {
        const quality = recording.quality || "unknown";
        stats[quality] = (stats[quality] || 0) + 1;
        return stats;
      },
      {}
    );

    // Recordings by month (last 12 months)
    const recordingsByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      const monthRecordings = recordings.filter((recording) => {
        const recordingDate = new Date(recording.createdAt);
        const recordingMonthKey = `${recordingDate.getFullYear()}-${(
          recordingDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}`;
        return recordingMonthKey === monthKey;
      }).length;

      recordingsByMonth.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        count: monthRecordings,
      });
    }

    // Top recordings by views
    const topRecordings = recordings
      .filter((r) => r.status === "ready")
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((recording) => ({
        id: recording.id,
        title: recording.title,
        views: recording.views || 0,
        duration: recording.duration || 0,
        createdAt: recording.createdAt,
      }));

    // Calculate real sharing statistics
    const totalShares = 0; // For now, since sharing isn't fully implemented yet
    const publicRecordings = recordings.filter((r) => r.isPublic).length;

    return NextResponse.json({
      overview: {
        totalRecordings,
        totalViews,
        totalDuration: Math.round(totalDuration),
        totalSize,
        totalShares,
        publicRecordings,
      },
      viewsTimeline,
      qualityStats,
      recordingsByMonth,
      topRecordings,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
