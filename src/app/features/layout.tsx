import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - SmartRec",
  description: "Discover the powerful features of SmartRec screen recording",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 