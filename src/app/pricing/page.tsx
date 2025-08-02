"use client";

import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { CheckCircle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  comingSoon?: boolean;
  features: string[];
  buttonText: string;
  buttonColor: string;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with screen recording",
    popular: false,
    features: [
      "Up to 5 recordings per month",
      "720p HD quality",
      "Basic AI transcription",
      "5GB cloud storage",
      "Standard support",
      "SmartRec watermark",
    ],
    buttonText: "Start Free",
    buttonColor: "#6b7280",
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Best for professionals and content creators",
    popular: true,
    comingSoon: true,
    features: [
      "Unlimited recordings",
      "4K Ultra HD quality",
      "Advanced AI transcription & summaries",
      "100GB cloud storage",
      "Priority support",
      "No watermarks",
      "Custom branding",
      "Advanced analytics",
      "Team collaboration (up to 5 members)",
    ],
    buttonText: "Coming Soon",
    buttonColor: "#a855f7",
  },
  {
    name: "Team",
    price: "$24",
    period: "per user/month",
    description: "Designed for teams and organizations",
    popular: false,
    comingSoon: true,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "500GB shared storage",
      "Advanced team analytics",
      "Single Sign-On (SSO)",
      "Admin controls",
      "API access",
      "Custom integrations",
      "24/7 dedicated support",
    ],
    buttonText: "Coming Soon",
    buttonColor: "#10b981",
  },
];

export default function PricingPage() {
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
                label="💰 Simple Pricing"
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
                Choose the Perfect Plan for Your Needs
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
                Start free and upgrade anytime. No hidden fees, cancel anytime.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Pricing Cards */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 4,
              }}
            >
              {plans.map((plan, index) => (
                <Tooltip
                  key={index}
                  title={
                    plan.comingSoon
                      ? "This plan will be available soon! Currently, we're focusing on our free tier."
                      : ""
                  }
                  arrow
                  placement="top"
                >
                  <Card
                    elevation={0}
                    sx={{
                      position: "relative",
                      backgroundColor: "white",
                      border: plan.popular
                        ? "2px solid #a855f7"
                        : "1px solid #f1f5f9",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 20px 40px -8px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 10,
                        }}
                      >
                        <Chip
                          label="Most Popular"
                          sx={{
                            backgroundColor: "#a855f7",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "0 12px",
                            "& .MuiChip-label": {
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                          }}
                        />
                      </Box>
                    )}

                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        {/* Plan Header */}
                        <Box textAlign="center">
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              color: "#1a1a1a",
                            }}
                          >
                            {plan.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              mb: 3,
                            }}
                          >
                            {plan.description}
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="h2"
                              component="span"
                              sx={{
                                fontSize: "3rem",
                                fontWeight: 800,
                                color: "#1a1a1a",
                              }}
                            >
                              {plan.price}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                color: "#6b7280",
                                ml: 1,
                              }}
                            >
                              {plan.period}
                            </Typography>
                          </Box>

                          <Button
                            component={plan.comingSoon ? "button" : Link}
                            href={plan.comingSoon ? undefined : "/record"}
                            variant="contained"
                            fullWidth
                            disabled={plan.comingSoon}
                            startIcon={
                              plan.comingSoon ? (
                                <Sparkles size={18} />
                              ) : (
                                <Zap size={18} />
                              )
                            }
                            sx={{
                              backgroundColor: plan.buttonColor,
                              color: "white",
                              fontWeight: 600,
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: "none",
                              opacity: plan.comingSoon ? 0.6 : 1,
                              cursor: plan.comingSoon
                                ? "not-allowed"
                                : "pointer",
                              "&:hover": plan.comingSoon
                                ? {
                                    opacity: 0.6,
                                  }
                                : {
                                    backgroundColor: plan.buttonColor,
                                    opacity: 0.9,
                                  },
                              "&:disabled": {
                                backgroundColor: plan.buttonColor,
                                color: "white",
                                opacity: 0.6,
                              },
                            }}
                          >
                            {plan.buttonText}
                          </Button>
                        </Box>

                        {/* Features List */}
                        <List sx={{ p: 0 }}>
                          {plan.features.map((feature, featureIndex) => (
                            <ListItem
                              key={featureIndex}
                              sx={{ px: 0, py: 0.5 }}
                            >
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle size={16} color="#10b981" />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{
                                  fontSize: "0.9rem",
                                  color: "#374151",
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Stack>
                    </CardContent>
                  </Card>
                </Tooltip>
              ))}
            </Box>

            {/* Contact Section */}
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
                Have questions about pricing or need a custom solution? Our
                sales team is here to help you choose the perfect plan.
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
                Contact Sales Team
              </Button>
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
