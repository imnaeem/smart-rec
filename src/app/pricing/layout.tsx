import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - SmartRec",
  description: "Choose the perfect plan for your screen recording needs",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 