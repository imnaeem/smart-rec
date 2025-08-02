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
  Target,
  Heart,
  Users,
  Globe,
  Sparkles,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Innovation First",
    description:
      "We constantly push the boundaries of what's possible in screen recording technology.",
    color: "#a855f7",
    backgroundColor: "#f3e8ff",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Every feature we build is designed with our users' needs and feedback at the center.",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "We prioritize the security and privacy of your content with enterprise-grade protection.",
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "Making powerful screen recording tools accessible to everyone, regardless of technical expertise.",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
  },
];

const team = [
  {
    name: "Muhammad Naeem",
    role: "CEO & Founder",
    bio: "Former VP of Product at tech startup, passionate about democratizing content creation.",
    avatar: "M",
    color: "#a855f7",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Lead engineer with 10+ years in video technology and AI-powered applications.",
    avatar: "S",
    color: "#3b82f6",
  },
  {
    name: "Alex Rodriguez",
    role: "Head of Design",
    bio: "UX designer focused on creating intuitive experiences for complex workflows.",
    avatar: "A",
    color: "#10b981",
  },
  {
    name: "David Kim",
    role: "VP of Engineering",
    bio: "Full-stack engineer specializing in scalable cloud infrastructure and real-time systems.",
    avatar: "D",
    color: "#f59e0b",
  },
];

const stats = [
  {
    number: "50,000+",
    label: "Active Users",
    icon: Users,
  },
  {
    number: "500,000+",
    label: "Recordings Created",
    icon: Zap,
  },
  {
    number: "25+",
    label: "Countries Served",
    icon: Globe,
  },
  {
    number: "99.9%",
    label: "Uptime",
    icon: Shield,
  },
];

export default function AboutPage() {
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
                label="🚀 About SmartRec"
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
                Revolutionizing Screen Recording with AI
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  fontSize: { xs: "1.125rem", md: "1.25rem" },
                  lineHeight: 1.6,
                  color: "#525252",
                }}
              >
                We&apos;re on a mission to make professional screen recording
                accessible to everyone. From educators to entrepreneurs,
                SmartRec empowers creators with AI-powered tools that transform
                how content is created and shared.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box py={{ xs: 4, md: 6 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 4,
                justifyItems: "center",
              }}
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Box key={index} textAlign="center">
                    <IconComponent
                      size={32}
                      color="#a855f7"
                      style={{ marginBottom: 16 }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#1a1a1a",
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* Story Section */}
        <Box
          id="story"
          py={{ xs: 6, md: 8 }}
          sx={{ backgroundColor: "#f8fafc" }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 6,
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: "#1a1a1a",
                  }}
                >
                  Our Story
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "#374151",
                    mb: 3,
                  }}
                >
                  SmartRec was born from a simple frustration: existing screen
                  recording tools were either too complex for beginners or too
                  basic for professionals. Our founders, having worked in
                  education and tech, saw the need for a solution that could
                  bridge this gap.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "#374151",
                    mb: 3,
                  }}
                >
                  Since launching in 2024, we&apos;ve grown from a small team
                  with a big vision to a platform trusted by thousands of
                  creators worldwide. Our AI-powered features have transformed
                  how people create, share, and discover content.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "#374151",
                  }}
                >
                  Today, SmartRec continues to evolve, always with our users at
                  the heart of everything we do. We&apos;re building the future
                  of content creation, one recording at a time.
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background decorative elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "20%",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "20%",
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                />
                <Lightbulb size={120} />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Values Section */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#1a1a1a",
                textAlign: "center",
              }}
            >
              Our Values
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "600px",
                mx: "auto",
                color: "#6b7280",
                textAlign: "center",
                mb: 6,
              }}
            >
              These core principles guide everything we do and every decision we
              make.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 8,
                alignItems: "center",
              }}
            >
              {/* Values Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 4,
                }}
              >
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <Card
                      key={index}
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
                          borderColor: value.color,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Stack
                          direction="row"
                          spacing={3}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              backgroundColor: value.backgroundColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: value.color,
                              flexShrink: 0,
                            }}
                          >
                            <IconComponent size={24} />
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: "#1a1a1a",
                              }}
                            >
                              {value.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: 1.6,
                                color: "#666666",
                              }}
                            >
                              {value.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              {/* Visual Showcase */}
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 300, lg: 500 },
                  display: { xs: "none", lg: "block" },
                }}
              >
                {/* Background Shapes */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "15%",
                    right: "25%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    opacity: 0.1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "60%",
                    right: "10%",
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                    opacity: 0.1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "15%",
                    width: 100,
                    height: 100,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    opacity: 0.1,
                  }}
                />

                {/* Value Icons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "25%",
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    backgroundColor: "#f3e8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <Target size={40} color="#a855f7" />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: "55%",
                    right: "30%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <Users size={32} color="#3b82f6" />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "25%",
                    left: "35%",
                    width: 85,
                    height: 85,
                    borderRadius: "50%",
                    backgroundColor: "#d1fae5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Shield size={36} color="#10b981" />
                </Box>

                {/* Central Heart Icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 12px 32px -8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Heart size={40} color="#ef4444" />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Team Section */}
        <Box
          id="team"
          py={{ xs: 6, md: 8 }}
          sx={{ backgroundColor: "#f8fafc" }}
        >
          <Container maxWidth="xl">
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "#1a1a1a",
                }}
              >
                Meet Our Team
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  mx: "auto",
                  color: "#6b7280",
                }}
              >
                The passionate people behind SmartRec, working to make screen
                recording better for everyone.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2.5,
                justifyItems: "stretch",
              }}
            >
              {team.map((member, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #f1f5f9",
                    borderRadius: 3,
                    textAlign: "center",
                    height: "100%",
                    maxWidth: "300px",
                    mx: "auto",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 12px 24px -8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Avatar
                      sx={{
                        width: 52,
                        height: 52,
                        backgroundColor: member.color,
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: "#1a1a1a",
                        fontSize: "1rem",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: member.color,
                        fontWeight: 600,
                        mb: 1,
                        fontSize: "0.8rem",
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        lineHeight: 1.4,
                        fontSize: "0.8rem",
                      }}
                    >
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
