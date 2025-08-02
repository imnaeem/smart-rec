"use client";

import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Video,
  Mic,
  Monitor,
  Users,
  Zap,
  Search,
  Share2,
  Settings,
  Lock,
  Cloud,
  Download,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Multiple Recording Modes",
    description:
      "Record your screen, camera, or both simultaneously with crystal clear quality and professional results.",
    color: "#a855f7",
    backgroundColor: "#f3e8ff",
  },
  {
    icon: Mic,
    title: "AI Transcription",
    id: "ai",
    description:
      "Automatic subtitles and transcripts powered by advanced AI technology for accessibility and searchability.",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
  },
  {
    icon: Sparkles,
    title: "Smart Summaries",
    description:
      "AI-generated summaries highlight key points from your recordings, saving time for viewers.",
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Search inside video transcripts to find exactly what you need, making content discoverable.",
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
  {
    icon: Share2,
    title: "Instant Sharing",
    description:
      "Share via link, QR code, or directly to social media platforms with customizable privacy settings.",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    id: "collaboration",
    description:
      "Real-time comments, reactions, and team workspaces for better collaboration and feedback.",
    color: "#8b5cf6",
    backgroundColor: "#ede9fe",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description:
      "Works seamlessly across all devices and browsers with no software installation required.",
    color: "#06b6d4",
    backgroundColor: "#cffafe",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    description:
      "Enterprise-grade security with end-to-end encryption and customizable privacy controls.",
    color: "#84cc16",
    backgroundColor: "#dcfce7",
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description:
      "Secure cloud storage with automatic backups and cross-device synchronization.",
    color: "#f97316",
    backgroundColor: "#fed7aa",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description:
      "Export your recordings in various formats including MP4, WebM, and audio-only options.",
    color: "#ec4899",
    backgroundColor: "#fce7f3",
  },
  {
    icon: Settings,
    title: "Advanced Settings",
    description:
      "Customize quality, frame rate, audio settings, and more for professional recordings.",
    color: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures smooth recording and playback even for long sessions.",
    color: "#14b8a6",
    backgroundColor: "#ccfbf1",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #e0e7ff 0%, #fef3ff 50%, #f0f9ff 100%)",
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="xl">
            <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
              <Chip
                icon={<Sparkles size={16} />}
                label="🚀 Powerful Features"
                sx={{
                  mb: 4,
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  color: "#7c3aed",
                  fontWeight: 600,
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
              />

              <Typography
                variant="h1"
                component="h1"
                sx={{
                  mb: 3,
                  fontSize: { xs: "2.5rem", sm: "3rem", lg: "3.5rem" },
                  fontWeight: 800,
                  color: "#1a1a1a",
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Everything You Need for Professional Screen Recording
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  mx: "auto",
                  fontSize: { xs: "1.125rem", md: "1.25rem" },
                  lineHeight: 1.6,
                  color: "#525252",
                }}
              >
                Discover all the powerful features that make SmartRec the
                perfect choice for creators, educators, and professionals.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Features Grid */}
        <Box
          id="recording"
          py={{ xs: 6, md: 8 }}
          sx={{ backgroundColor: "white" }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 4,
              }}
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={index}
                    id={feature.id}
                    elevation={0}
                    sx={{
                      height: "100%",
                      backgroundColor: "white",
                      border: "1px solid #f1f5f9",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 20px 40px -8px rgba(0,0,0,0.1)",
                        borderColor: feature.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            backgroundColor: feature.backgroundColor,
                            color: feature.color,
                            "& svg": {
                              width: 28,
                              height: 28,
                            },
                          }}
                        >
                          <IconComponent />
                        </Avatar>

                        <Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              mb: 2,
                              color: "#1a1a1a",
                            }}
                          >
                            {feature.title}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.7,
                              color: "#666666",
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
