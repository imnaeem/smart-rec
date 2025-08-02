"use client";

import { useState } from "react";
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
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Mail, Phone, MapPin, Send, Sparkles, Clock } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description:
      "Get help with technical issues, billing, or general questions.",
    contact: "contact@muhammadnaeem.me",
    responseTime: "Within 24 hours",
    color: "#a855f7",
    backgroundColor: "#f3e8ff",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team for urgent matters.",
    contact: "+1 (555) 123-4567",
    responseTime: "Business hours only",
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
  {
    icon: MapPin,
    title: "Office Location",
    description: "Visit our headquarters in San Francisco.",
    contact: "123 Innovation St, SF, CA 94102",
    responseTime: "By appointment",
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
];

const inquiryTypes = [
  "General Inquiry",
  "Technical Support",
  "Billing & Pricing",
  "Feature Request",
  "Partnership Opportunity",
  "Media & Press",
  "Bug Report",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    inquiryType: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message:
            "Message sent successfully! We&apos;ll get back to you soon.",
          severity: "success",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          inquiryType: "",
          subject: "",
          message: "",
        });
      } else {
        const error = await response.json();
        setSnackbar({
          open: true,
          message: error.error || "Failed to send message. Please try again.",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                label="💬 Contact Us"
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
                We're Here to Help
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
                Have questions about SmartRec? Need technical support? Want to
                share feedback? We'd love to hear from you.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Contact Methods */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
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
                Get in Touch
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  mx: "auto",
                  color: "#6b7280",
                }}
              >
                Choose the best way to reach us based on your needs.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 4,
                justifyItems: "stretch", // Ensure equal width cards
              }}
            >
              {contactMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card
                    key={method.title}
                    elevation={0}
                    sx={{
                      height: "100%",
                      width: "100%", // Ensure full width
                      maxWidth: "400px", // Consistent max width
                      mx: "auto", // Center the card
                      backgroundColor: "white",
                      border: "1px solid #f1f5f9",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 20px 40px -8px rgba(0,0,0,0.1)",
                        borderColor: method.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Stack spacing={3} alignItems="center">
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            backgroundColor: method.backgroundColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: method.color,
                          }}
                        >
                          <IconComponent size={32} />
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
                            {method.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              mb: 3,
                              lineHeight: 1.6,
                            }}
                          >
                            {method.description}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: method.color,
                              mb: 1,
                            }}
                          >
                            {method.contact}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            <Clock size={14} color="#6b7280" />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#6b7280",
                              }}
                            >
                              {method.responseTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* Contact Form */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "#f8fafc" }}>
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
              Send us a Message
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6b7280",
                lineHeight: 1.7,
                mb: 6,
                textAlign: "center",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Fill out the form and we&apos;ll get back to you as soon as
              possible. For urgent matters, please use our phone support.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 8,
                alignItems: "center",
              }}
            >
              {/* Contact Form */}
              <Card
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #f1f5f9",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        width: "100%", // Ensure full width container
                      }}
                    >
                      <TextField
                        label="First Name"
                        variant="outlined"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange("firstName")}
                        sx={{
                          width: "100%", // Full width in grid cell
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label="Last Name"
                        variant="outlined"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange("lastName")}
                        sx={{
                          width: "100%", // Full width in grid cell
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      required
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Company (Optional)"
                      variant="outlined"
                      value={formData.company}
                      onChange={handleInputChange("company")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      select
                      label="Inquiry Type"
                      variant="outlined"
                      required
                      value={formData.inquiryType}
                      onChange={handleInputChange("inquiryType")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      {inquiryTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      required
                      value={formData.subject}
                      onChange={handleInputChange("subject")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      value={formData.message}
                      onChange={handleInputChange("message")}
                      placeholder="Please describe your question or issue in detail..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      endIcon={
                        isSubmitting ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <Send size={18} />
                        )
                      }
                      sx={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#9333ea",
                        },
                        "&:disabled": {
                          backgroundColor: "#9ca3af",
                        },
                      }}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

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
                    top: "10%",
                    right: "20%",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    opacity: 0.1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "60%",
                    right: "5%",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                    opacity: 0.1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "30%",
                    left: "10%",
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    opacity: 0.1,
                  }}
                />

                {/* Contact Icons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "20%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "#f3e8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <Mail size={40} color="#a855f7" />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "30%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#d1fae5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Phone size={32} color="#10b981" />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "20%",
                    left: "30%",
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 8px 24px -8px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <MapPin size={36} color="#f59e0b" />
                </Box>

                {/* Central Message Icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 12px 32px -8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Send size={48} color="#6b7280" />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Documentation Section */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="lg">
            <Box
              textAlign="center"
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
                Need Documentation?
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
                Check out our comprehensive documentation for detailed guides,
                tutorials, and troubleshooting tips.
              </Typography>
              <Button
                component="a"
                href="/docs"
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
                View Documentation
              </Button>
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            backgroundColor:
              snackbar.severity === "success" ? "#10b981" : "#ef4444",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
