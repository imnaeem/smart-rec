import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Recordings - SmartRec",
  description: "View and manage your screen recordings",
};

export default function RecordingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 