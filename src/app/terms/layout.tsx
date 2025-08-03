import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SmartRec",
  description: "Terms and conditions for using SmartRec services",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 