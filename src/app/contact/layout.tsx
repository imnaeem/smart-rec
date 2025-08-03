import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - SmartRec",
  description: "Get in touch with the SmartRec team for support and inquiries",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 