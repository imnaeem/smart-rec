"use client";

import { Container, Typography, Button, Box, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function CtaSection() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        color: "white",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        "@media (min-width: 900px)": {
          paddingTop: "4rem",
          paddingBottom: "4rem",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        }}
      >
        {/* Large Triangle */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 0,
            height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderBottom: "150px solid rgba(251, 191, 36, 0.4)",
            transform: "rotate(25deg)",
            display: { xs: "none", md: "block" },
          }}
        />

        {/* Diamond Shape */}
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "8%",
            width: "80px",
            height: "80px",
            background: "rgba(16, 185, 129, 0.4)",
            transform: "rotate(45deg)",
            borderRadius: "10px",
            display: { xs: "none", md: "block" },
          }}
        />

        {/* Circle */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "120px",
            height: "120px",
            background: "rgba(239, 68, 68, 0.3)",
            borderRadius: "50%",
            display: { xs: "none", md: "block" },
          }}
        />

        {/* Small Triangles */}
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: 0,
            height: 0,
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "40px solid rgba(59, 130, 246, 0.5)",
            transform: "rotate(-15deg)",
            display: { xs: "none", sm: "block" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "40%",
            right: "25%",
            width: 0,
            height: 0,
            borderLeft: "25px solid transparent",
            borderRight: "25px solid transparent",
            borderBottom: "35px solid rgba(168, 85, 247, 0.4)",
            transform: "rotate(60deg)",
            display: { xs: "none", sm: "block" },
          }}
        />

        {/* Diagonal Lines */}
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "40%",
            width: "200px",
            height: "4px",
            background: "rgba(255, 255, 255, 0.2)",
            transform: "rotate(25deg)",
            borderRadius: "2px",
            display: { xs: "none", lg: "block" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "40%",
            left: "60%",
            width: "150px",
            height: "3px",
            background: "rgba(251, 191, 36, 0.3)",
            transform: "rotate(-35deg)",
            borderRadius: "2px",
            display: { xs: "none", lg: "block" },
          }}
        />

        {/* Hexagon */}
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "25%",
            width: "60px",
            height: "60px",
            background: "rgba(34, 197, 94, 0.4)",
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            display: { xs: "none", md: "block" },
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box textAlign="center">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              color: "white",
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
            }}
          >
            Ready to Transform Your
            <br />
            Screen Recording Experience?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 3,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              lineHeight: 1.6,
            }}
          >
            Join thousands of creators, educators, and professionals who trust
            SmartRec for their recording needs. Start creating amazing content
            today.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/auth/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              sx={{
                backgroundColor: "#fbbf24",
                color: "#1f2937",
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: "1.125rem",
                borderRadius: 3,
                boxShadow: "0 10px 30px -10px rgba(251, 191, 36, 0.4)",
                "&:hover": {
                  backgroundColor: "#f59e0b",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 35px -10px rgba(251, 191, 36, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started Free
            </Button>
            <Tooltip title="Coming Soon"> 
              <Button
                href="#"
                component={Link}
                variant="outlined"
                size="large"
                startIcon={<Play size={20} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  fontWeight: 600,
                  px: 5,
                  py: 2,
                  fontSize: "1.125rem",
                  borderRadius: 3,
                  borderWidth: 2,
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Watch Demo
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
