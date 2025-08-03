import { Metadata } from "next";
import { generateRecordingMetadata } from "@/lib/utils/metadata";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    // Try to fetch recording data for dynamic title
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/recordings/public/${id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const recording = await response.json();
      return generateRecordingMetadata(recording);
    }
  } catch (error) {
    // Fallback if fetch fails
  }

  return {
    title: "Watch Recording - SmartRec",
    description: "View and watch screen recordings shared with you",
  };
}

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 