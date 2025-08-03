import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Record - SmartRec",
  description: "Create new screen recordings with advanced settings",
};

export default function RecordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 