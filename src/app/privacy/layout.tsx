import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SmartRec",
  description: "Learn how SmartRec protects your privacy and data",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 