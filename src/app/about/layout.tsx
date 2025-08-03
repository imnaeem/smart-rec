import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - SmartRec",
  description: "Learn about SmartRec and our mission to revolutionize screen recording",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 