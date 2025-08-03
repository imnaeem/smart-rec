import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SmartRec",
  description: "Manage your screen recordings and view analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 