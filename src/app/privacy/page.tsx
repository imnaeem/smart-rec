"use client";

import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Container, Typography, Box, Stack, Chip } from "@mui/material";
import { Shield, Sparkles } from "lucide-react";

export default function PrivacyPage() {
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
          <Container maxWidth="lg">
            <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
              <Chip
                icon={<Shield size={16} />}
                label="🔒 Privacy Policy"
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
                }}
              >
                Privacy Policy
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
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "#6b7280",
                }}
              >
                Last updated: December 2024
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="lg">
            <Stack spacing={6}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Information We Collect
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  We collect information you provide directly to us, such as
                  when you create an account, use our services, or contact us
                  for support.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
                >
                  Information you provide to us:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information and preferences</li>
                  <li>
                    Content you create, upload, or share through our service
                  </li>
                  <li>Communications with us (support requests, feedback)</li>
                  <li>
                    Payment information (processed securely by third-party
                    providers)
                  </li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  How We Use Your Information
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  We use the information we collect to provide, maintain, and
                  improve our services:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>
                    Provide and deliver the products and services you request
                  </li>
                  <li>Process transactions and send related information</li>
                  <li>
                    Send technical notices, updates, security alerts, and
                    support messages
                  </li>
                  <li>
                    Respond to your comments, questions, and customer service
                    requests
                  </li>
                  <li>
                    Monitor and analyze trends, usage, and activities in
                    connection with our services
                  </li>
                  <li>
                    Detect, investigate, and prevent fraudulent transactions and
                    other illegal activities
                  </li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Information Sharing and Disclosure
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties except as described in this
                  policy:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>With your consent or at your direction</li>
                  <li>
                    With third-party vendors and service providers who perform
                    services on our behalf
                  </li>
                  <li>
                    To comply with laws, regulations, legal processes, or
                    governmental requests
                  </li>
                  <li>
                    To protect our rights, property, or safety, or that of our
                    users or others
                  </li>
                  <li>
                    In connection with a merger, acquisition, or sale of assets
                  </li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Data Security
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  We take reasonable measures to help protect your personal
                  information from loss, theft, misuse, unauthorized access,
                  disclosure, alteration, and destruction. We use
                  industry-standard encryption and security practices to protect
                  your data both in transit and at rest.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Your Rights and Choices
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  You have certain rights regarding your personal information:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>
                    Access and update your account information at any time
                  </li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your personal information</li>
                  <li>
                    Restrict or object to certain processing of your information
                  </li>
                </Box>
              </Box>

              <Box id="cookies">
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Cookies and Tracking Technologies
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  We use cookies and similar tracking technologies to track
                  activity on our service and store certain information. You can
                  instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent.
                </Typography>
              </Box>

              <Box id="gdpr">
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  International Data Transfers
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  Your information may be transferred to and maintained on
                  computers located outside of your jurisdiction where privacy
                  laws may differ. We ensure appropriate safeguards are in place
                  for such transfers.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Changes to This Policy
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page and updating the "Last updated" date.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Contact Us
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </Typography>
                <Box sx={{ mt: 2, color: "#374151" }}>
                  <Typography>Email: contact@muhammadnaeem.me</Typography>
                  <Typography>
                    Address: 123 Innovation St, San Francisco, CA 94102
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
