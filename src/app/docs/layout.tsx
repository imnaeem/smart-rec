import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - SmartRec",
  description: "Comprehensive documentation and guides for SmartRec",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 