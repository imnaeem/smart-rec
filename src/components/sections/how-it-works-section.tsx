"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
} from "@mui/material";
import { Play, Settings, Share2, Sparkles, Zap } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Play,
    title: "Start Recording",
    description:
      "Click record and choose your screen, window, or camera. SmartRec handles the technical setup automatically.",
    color: "#a855f7",
    backgroundColor: "#f3e8ff",
  },
  {
    step: "02",
    icon: Settings,
    title: "AI Enhancement",
    description:
      "Our AI automatically generates transcripts, summaries, and optimizes your recording for maximum impact.",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
  },
  {
    step: "03",
    icon: Share2,
    title: "Share Instantly",
    description:
      "Get a shareable link immediately. Your audience can watch, search, and interact with your content.",
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
];

export function HowItWorksSection() {
  return (
    <Box
      py={{ xs: 6, md: 8 }}
      sx={{
        backgroundColor: "#f8fafc",
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              px: 3,
              py: 1,
              backgroundColor: "#f3e8ff",
              borderRadius: "50px",
              border: "1px solid #e9d5ff",
            }}
          >
            <Sparkles size={18} color="#a855f7" />
            <Typography
              variant="body2"
              sx={{
                color: "#7c3aed",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Simple Process
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            How SmartRec Works
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: "500px",
              mx: "auto",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              lineHeight: 1.6,
              color: "#525252",
            }}
          >
            Get professional screen recordings in three simple steps
          </Typography>
        </Box>

        {/* Steps - 2 Column Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 6, lg: 8 },
            alignItems: "center",
          }}
        >
          {/* Left Column - Steps */}
          <Stack
            direction="column"
            spacing={{ xs: 3, md: 4 }}
            sx={{ position: "relative" }}
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Box
                  key={step.title}
                  sx={{ position: "relative", width: "100%" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width: "100%",
                      backgroundColor: "white",
                      border: "1px solid #f1f5f9",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      position: "relative",
                      zIndex: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0px 12px 24px -8px rgba(0,0,0,0.1)",
                        borderColor: step.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: { xs: "flex-start", md: "center" },
                          gap: { xs: 2, md: 4 },
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        {/* Left side - Step Number and Icon */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "row", sm: "column" },
                            alignItems: "center",
                            minWidth: { xs: "auto", sm: "120px" },
                            gap: { xs: 2, sm: 0 },
                            width: { xs: "100%", sm: "auto" },
                            justifyContent: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          {/* Step Number */}
                          <Typography
                            variant="h4"
                            sx={{
                              color: "#e5e7eb",
                              fontWeight: 800,
                              fontSize: { xs: "2rem", md: "2.5rem" },
                              lineHeight: 1,
                              mb: { xs: 0, sm: 2 },
                            }}
                          >
                            {step.step}
                          </Typography>

                          {/* Icon */}
                          <Avatar
                            sx={{
                              width: { xs: 48, md: 64 },
                              height: { xs: 48, md: 64 },
                              backgroundColor: step.backgroundColor,
                              color: step.color,
                              "& svg": {
                                width: { xs: 24, md: 32 },
                                height: { xs: 24, md: 32 },
                              },
                            }}
                          >
                            <IconComponent />
                          </Avatar>
                        </Box>

                        {/* Right side - Content */}
                        <Box sx={{ flex: 1 }}>
                          {/* Title */}
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              mb: 2,
                              color: "#1a1a1a",
                            }}
                          >
                            {step.title}
                          </Typography>

                          {/* Description */}
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.7,
                              color: "#666666",
                              fontSize: "1rem",
                            }}
                          >
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Stack>

          {/* Right Column - Visual Showcase */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Main Showcase Container */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "400px",
                height: "500px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Header Bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "60px",
                  background: "#ffffff",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  px: 3,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#ef4444",
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#f59e0b",
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    height: "32px",
                    background: "#f8fafc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", fontSize: "0.875rem" }}
                  >
                    🎥 SmartRec - Recording...
                  </Typography>
                </Box>
              </Box>

              {/* Recording Interface */}
              <Box
                sx={{
                  mt: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* Record Button */}
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.4)",
                    position: "relative",
                  }}
                >
                  <Play size={40} color="white" fill="white" />
                  {/* Pulse Animation */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      border: "3px solid #ef4444",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)", opacity: 1 },
                        "100%": { transform: "scale(1.3)", opacity: 0 },
                      },
                    }}
                  />
                </Box>

                {/* Recording Status */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1f2937",
                      mb: 1,
                    }}
                  >
                    Recording in Progress
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    AI transcription active
                  </Typography>
                </Box>

                {/* Feature Icons */}
                <Stack direction="row" spacing={3}>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: 2,
                      background: "rgba(168, 85, 247, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={24} color="#a855f7" />
                  </Box>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: 2,
                      background: "rgba(16, 185, 129, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={24} color="#10b981" />
                  </Box>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: 2,
                      background: "rgba(59, 130, 246, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Settings size={24} color="#3b82f6" />
                  </Box>
                </Stack>
              </Box>

              {/* Bottom Progress Bar */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  height: "8px",
                  background: "#f1f5f9",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "65%",
                    height: "100%",
                    background: "linear-gradient(90deg, #a855f7, #3b82f6)",
                    borderRadius: "4px",
                    animation: "progress 3s ease-in-out infinite",
                    "@keyframes progress": {
                      "0%": { width: "20%" },
                      "50%": { width: "75%" },
                      "100%": { width: "20%" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Floating Geometric Shapes */}
            {/* Triangle */}
            <Box
              sx={{
                position: "absolute",
                top: "15%",
                right: "-8%",
                width: 0,
                height: 0,
                borderLeft: "30px solid transparent",
                borderRight: "30px solid transparent",
                borderBottom: "40px solid rgba(251, 191, 36, 0.2)",
                transform: "rotate(15deg)",
              }}
            />

            {/* Circle */}
            <Box
              sx={{
                position: "absolute",
                bottom: "25%",
                left: "-8%",
                width: "50px",
                height: "50px",
                background: "rgba(168, 85, 247, 0.15)",
                borderRadius: "50%",
              }}
            />

            {/* Diamond/Crystal */}
            <Box
              sx={{
                position: "absolute",
                top: "40%",
                right: "-5%",
                width: "35px",
                height: "35px",
                background: "rgba(16, 185, 129, 0.2)",
                transform: "rotate(45deg)",
                borderRadius: "4px",
              }}
            />

            {/* Line/Rectangle */}
            <Box
              sx={{
                position: "absolute",
                bottom: "45%",
                left: "-6%",
                width: "60px",
                height: "4px",
                background: "rgba(59, 130, 246, 0.3)",
                borderRadius: "2px",
                transform: "rotate(-25deg)",
              }}
            />

            {/* Small Triangle */}
            <Box
              sx={{
                position: "absolute",
                top: "65%",
                right: "-3%",
                width: 0,
                height: 0,
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                borderBottom: "20px solid rgba(239, 68, 68, 0.2)",
                transform: "rotate(-30deg)",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
