import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - SmartRec",
  description: "Sign in or create your SmartRec account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 