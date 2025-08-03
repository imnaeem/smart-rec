import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - SmartRec",
  description: "Latest news, tips, and insights about screen recording and SmartRec",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 