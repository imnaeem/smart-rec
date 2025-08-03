import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // This would need to be implemented with proper authentication
    // For now, return a generic title
    return {
      title: "Recording Details - SmartRec",
      description: "View and manage your recording details",
    };
  } catch (error) {
    return {
      title: "Recording Details - SmartRec",
      description: "View and manage your recording details",
    };
  }
}

export default function RecordingDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 