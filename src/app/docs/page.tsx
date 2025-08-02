"use client";

import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import {
  BookOpen,
  Video,
  Settings,
  Users,
  HelpCircle,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const docSections = [
  {
    icon: Video,
    title: "Getting Started",
    id: "getting-started",
    description: "Learn the basics of screen recording with SmartRec",
    color: "#a855f7",
    backgroundColor: "#f3e8ff",
    content:
      "Get up and running with SmartRec in minutes. Learn how to set up your account, navigate the interface, configure basic settings, and create your first high-quality screen recording.",
  },
  {
    icon: Settings,
    title: "Recording Features",
    description: "Master all recording modes and advanced features",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    content:
      "Explore advanced recording options including screen capture, camera overlay, audio configuration, and quality settings. Learn how to optimize your recordings for different use cases and platforms.",
  },
  {
    icon: Sparkles,
    title: "AI Features",
    description: "Leverage AI-powered transcription and summaries",
    color: "#10b981",
    backgroundColor: "#d1fae5",
    content:
      "Discover how AI enhances your recordings with automatic transcription, intelligent summaries, and powerful search capabilities. Support for multiple languages and smart content analysis.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team effectively",
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
    content:
      "Set up team workspaces, manage user permissions, and collaborate efficiently. Learn how to share recordings, collect feedback through comments, and organize your team's content.",
  },
  {
    icon: FileText,
    title: "Export & Sharing",
    description: "Learn how to export and share your recordings",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    content:
      "Master different export formats, sharing options, and collaboration features. Learn how to optimize your recordings for different platforms and audiences.",
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Common issues and their solutions",
    color: "#8b5cf6",
    backgroundColor: "#ede9fe",
    content:
      "Find solutions to common problems, browser compatibility issues, and performance optimization tips. Get help with error messages and learn best practices for smooth recording experiences.",
  },
];

export default function DocsPage() {
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
                icon={<BookOpen size={16} />}
                label="📚 Documentation"
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
                SmartRec Documentation
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  mx: "auto",
                  fontSize: { xs: "1.125rem", md: "1.25rem" },
                  lineHeight: 1.6,
                  color: "#525252",
                  mb: 4,
                }}
              >
                Everything you need to know about using SmartRec effectively.
                From basic recording to advanced features.
              </Typography>

              <Button
                component={Link}
                href="/"
                variant="contained"
                size="large"
                startIcon={<ArrowRight size={18} />}
                sx={{
                  backgroundColor: "#a855f7",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#9333ea",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Documentation Sections */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
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
              {docSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Card
                    key={section.title}
                    id={section.id}
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
                        borderColor: section.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            backgroundColor: section.backgroundColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: section.color,
                          }}
                        >
                          <IconComponent size={28} />
                        </Box>

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
                            {section.title}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.7,
                              color: "#666666",
                              mb: 3,
                            }}
                          >
                            {section.description}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                              color: "#6b7280",
                              p: 3,
                              backgroundColor: "#f8fafc",
                              borderRadius: 2,
                              border: "1px solid #f1f5f9",
                            }}
                          >
                            {section.content}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Help Section */}
            <Box
              textAlign="center"
              mt={8}
              p={6}
              sx={{
                backgroundColor: "#f8fafc",
                borderRadius: 3,
                border: "1px solid #f1f5f9",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#1a1a1a",
                }}
              >
                Need More Help?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  mb: 4,
                  maxWidth: "500px",
                  mx: "auto",
                }}
              >
                Can&apos;t find what you&apos;re looking for? Our support team
                is here to help you get the most out of SmartRec.
              </Typography>
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                sx={{
                  backgroundColor: "#a855f7",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#9333ea",
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
