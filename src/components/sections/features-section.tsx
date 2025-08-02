"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import { Video, Brain, Zap, Share2, Search, Users } from "lucide-react";

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
    icon: Brain,
    title: "AI Transcription",
    description:
      "Automatic subtitles and transcripts powered by advanced AI technology for accessibility and searchability.",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
  },
  {
    icon: Zap,
    title: "Smart Summaries",
    description:
      "AI-generated summaries highlight key points from your recordings, saving time for viewers.",
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
  {
    icon: Share2,
    title: "Instant Sharing",
    description:
      "Share via link, QR code, or directly to social media platforms with customizable privacy settings.",
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Search inside video transcripts to find exactly what you need, making content discoverable.",
    color: "#eab308",
    backgroundColor: "#fefce8",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time comments, reactions, and team workspaces for better collaboration and feedback.",
    color: "#22c55e",
    backgroundColor: "#dcfce7",
  },
];

export function FeaturesSection() {
  return (
    <Box py={{ xs: 6, md: 8 }} bgcolor="white">
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
              fontWeight: 700,
            }}
          >
            Everything you need to record like a pro
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
            Powerful features that make screen recording effortless and
            professional, with AI-powered enhancements that set us apart.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 2, md: 3 },
            mt: 1,
          }}
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                elevation={0}
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  border: "1px solid #f1f5f9",
                  borderRadius: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 24px -8px rgba(0,0,0,0.1)",
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Icon */}
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: feature.backgroundColor,
                        color: feature.color,
                        flexShrink: 0,
                        "& svg": {
                          width: 28,
                          height: 28,
                        },
                      }}
                    >
                      <IconComponent />
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
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
                          fontSize: "0.95rem",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
