"use client";

import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import {
  Play,
  Video,
  Sparkles,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Monitor,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #e0e7ff 0%, #fef3ff 50%, #f0f9ff 100%)",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, md: 6 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "rgba(168, 85, 247, 0.08)",
          borderRadius: "50%",
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          width: "200px",
          height: "200px",
          background: "rgba(59, 130, 246, 0.06)",
          borderRadius: "50%",
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "-50px",
          width: "150px",
          height: "150px",
          background: "rgba(16, 185, 129, 0.05)",
          borderRadius: "50%",
          display: { xs: "none", md: "block" },
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.3fr 0.7fr" },
            gap: { xs: 4, lg: 6 },
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <Box>
            {/* Badge */}
            <Chip
              icon={<Sparkles size={16} />}
              label="🚀 AI-Powered Screen Recording"
              sx={{
                mb: 4,
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                color: "#7c3aed",
                fontWeight: 600,
                border: "1px solid rgba(168, 85, 247, 0.2)",
              }}
            />

            {/* Main Heading */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontSize: { xs: "2.5rem", sm: "3.5rem", lg: "4.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#1f2937",
              }}
            >
              Record, Share &
              <br />
              <Typography
                component="span"
                sx={{
                  color: "#fbbf24",
                  display: "inline",
                }}
              >
                Collaborate
              </Typography>
              <br />
              Like Never Before
            </Typography>

            {/* Description */}
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                lineHeight: 1.6,
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                color: "#6b7280",
                fontWeight: 400,
                maxWidth: "500px",
              }}
            >
              Professional screen recording with AI transcription, smart
              summaries, and seamless team collaboration. Transform how you
              create and share content.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mb: 6 }}
            >
              <Button
                component={Link}
                href="/dashboard/record"
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{
                  backgroundColor: "#fbbf24",
                  color: "#1f2937",
                  "&:hover": {
                    backgroundColor: "#f59e0b",
                    transform: "translateY(-2px)",
                  },
                  boxShadow: "0 10px 30px -10px rgba(251, 191, 36, 0.4)",
                  px: 5,
                  py: 2,
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                }}
              >
                Start Recording Free
              </Button>

              <Tooltip title="Coming Soon"> 
                <Button
                  href="#"
                  component={Link}
                  variant="outlined"
                  size="large"
                  startIcon={<Play size={20} />}
                  sx={{
                    borderWidth: 2,
                    borderColor: "#a855f7",
                    color: "#a855f7",
                    px: 5,
                    py: 2,
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#9333ea",
                      backgroundColor: "rgba(168, 85, 247, 0.05)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Watch Demo
                </Button>
              </Tooltip>
            </Stack>

            {/* Features List */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 4 }}
              sx={{ mb: 6 }}
            >
              {["No Watermarks", "HD Quality", "AI Transcription"].map(
                (feature) => (
                  <Box
                    key={feature}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle size={16} color="#fbbf24" />
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {feature}
                    </Typography>
                  </Box>
                )
              )}
            </Stack>

            {/* Social Proof */}
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 3, sm: 4 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#ef4444" }}>J</Avatar>
                  <Avatar sx={{ bgcolor: "#10b981" }}>S</Avatar>
                  <Avatar sx={{ bgcolor: "#3b82f6" }}>A</Avatar>
                  <Avatar sx={{ bgcolor: "#f59e0b" }}>+</Avatar>
                </AvatarGroup>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1f2937",
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    50,000+ creators
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    trust SmartRec
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", color: "#fbbf24" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1f2937",
                    fontWeight: 600,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  4.9/5
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Visual Element */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Main Illustration Container */}
            <Box
              sx={{
                width: "400px",
                height: "400px",
                background: "rgba(168, 85, 247, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(168, 85, 247, 0.15)",
                position: "relative",
              }}
            >
              {/* Central Icon */}
              <Box
                sx={{
                  width: "120px",
                  height: "120px",
                  background: "rgba(251, 191, 36, 0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Video size={60} color="#fbbf24" />
              </Box>

              {/* Floating Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20%",
                  right: "10%",
                  width: "60px",
                  height: "60px",
                  background: "rgba(16, 185, 129, 0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Monitor size={30} color="#10b981" />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "15%",
                  left: "15%",
                  width: "50px",
                  height: "50px",
                  background: "rgba(59, 130, 246, 0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Zap size={25} color="#3b82f6" />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "5%",
                  width: "40px",
                  height: "40px",
                  background: "rgba(239, 68, 68, 0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Users size={20} color="#ef4444" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
