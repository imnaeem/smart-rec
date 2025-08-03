import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - SmartRec",
  description: "View detailed analytics and insights for your recordings",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 