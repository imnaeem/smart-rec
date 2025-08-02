"use client";

import {
  Container,
  Typography,
  Box,
  Link as MuiLink,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { Video } from "lucide-react";

const navigation = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        pt: { xs: 8, md: 12 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 6, md: 8 },
            mb: 6,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ flex: { md: "0 0 300px" } }}>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Video size={24} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: "#a855f7",
                  fontWeight: 700,
                }}
              >
                SmartRec
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: "#cccccc",
                lineHeight: 1.6,
                maxWidth: "280px",
              }}
            >
              Modern screen recording with AI-powered features for the next
              generation of creators, educators, and professionals.
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
              },
              gap: { xs: 4, sm: 6 },
              flex: 1,
            }}
          >
            {/* Product */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                Product
              </Typography>
              <Stack spacing={1.5}>
                {navigation.product.map((item) => (
                  <MuiLink
                    key={item.name}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: "#cccccc",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {item.name}
                  </MuiLink>
                ))}
              </Stack>
            </Box>

            {/* Company */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                Company
              </Typography>
              <Stack spacing={1.5}>
                {navigation.company.map((item) => (
                  <MuiLink
                    key={item.name}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: "#cccccc",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {item.name}
                  </MuiLink>
                ))}
              </Stack>
            </Box>

            {/* Get in Touch */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                Get in Touch
              </Typography>
              <Stack spacing={1.5}>
                <Box
                  sx={{
                    color: "#cccccc",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>📧</span> contact@muhammadnaeem.me
                </Box>
                <Box
                  sx={{
                    color: "#cccccc",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>📞</span> +1 (555) 123-4567
                </Box>
                <Box
                  sx={{
                    color: "#cccccc",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <span>📍</span>
                  <Box>
                    123 Innovation St
                    <br />
                    San Francisco, CA 94102
                    <br />
                    United States
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box>
          <Divider sx={{ borderColor: "#333333", mb: 4 }} />
          <Typography
            variant="body2"
            sx={{
              color: "#888888",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            © 2024 SmartRec. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
