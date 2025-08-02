import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartRec - Screen Recording Made Smart",
  description:
    "Record, share, and collaborate with AI-powered screen recording. Modern, fast, and user-friendly.",
  keywords: [
    "screen recording",
    "video sharing",
    "collaboration",
    "AI transcription",
  ],
  authors: [{ name: "SmartRec Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a855f7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
