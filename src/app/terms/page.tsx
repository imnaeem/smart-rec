"use client";

import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Container, Typography, Box, Stack, Chip } from "@mui/material";
import { FileText, Sparkles } from "lucide-react";

export default function TermsPage() {
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
                icon={<FileText size={16} />}
                label="📄 Terms of Service"
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
                Terms of Service
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
                These terms govern your use of SmartRec and our services. Please
                read them carefully.
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
                  1. Agreement to Terms
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  By accessing and using SmartRec, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to abide by the above, please do not use this
                  service.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  2. Description of Service
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  SmartRec provides screen recording, video sharing, and
                  collaboration tools with AI-powered features including
                  transcription and summarization. Our service allows users to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>Record screen, camera, or both simultaneously</li>
                  <li>Generate AI-powered transcripts and summaries</li>
                  <li>Share recordings with team members or publicly</li>
                  <li>Collaborate through comments and feedback</li>
                  <li>Store and organize recordings in the cloud</li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  3. User Accounts
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  To use certain features of our service, you must register for
                  an account. You agree to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  4. Acceptable Use Policy
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  You agree not to use our service to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>
                    Upload, post, or transmit any content that is illegal,
                    harmful, or offensive
                  </li>
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Distribute malware, viruses, or other harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>
                    Use the service for commercial purposes without
                    authorization
                  </li>
                  <li>
                    Record content without proper consent or authorization
                  </li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  5. Content and Intellectual Property
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  You retain ownership of content you create and upload to our
                  service. By uploading content, you grant us a limited license
                  to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>Store, process, and deliver your content</li>
                  <li>
                    Provide AI-powered features like transcription and
                    summarization
                  </li>
                  <li>Enable sharing and collaboration features</li>
                  <li>Backup and secure your content</li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  6. Privacy and Data Protection
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  Your privacy is important to us. Our collection and use of
                  personal information is governed by our Privacy Policy. By
                  using our service, you consent to the collection and use of
                  your information as described in our Privacy Policy.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  7. Payment and Billing
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151", mb: 3 }}
                >
                  For paid services:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: "#374151" }}>
                  <li>
                    Payments are processed securely by third-party providers
                  </li>
                  <li>Subscriptions renew automatically unless cancelled</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>Price changes will be communicated in advance</li>
                  <li>Late payments may result in service suspension</li>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  8. Service Availability
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  We strive to maintain high service availability but cannot
                  guarantee uninterrupted access. We may temporarily suspend the
                  service for maintenance, updates, or due to circumstances
                  beyond our control.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  9. Limitation of Liability
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  Our service is provided "as is" without warranties of any
                  kind. We shall not be liable for any indirect, incidental,
                  special, or consequential damages resulting from your use of
                  the service.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  10. Termination
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  Either party may terminate this agreement at any time. Upon
                  termination, your right to use the service ceases immediately.
                  We may delete your account and content after a reasonable
                  period following termination.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  11. Changes to Terms
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes. Continued use of the
                  service after changes constitutes acceptance of the new terms.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  12. Governing Law
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  These terms are governed by the laws of California, United
                  States. Any disputes will be resolved in the courts of San
                  Francisco County, California.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Contact Information
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "#374151" }}
                >
                  If you have questions about these Terms of Service, please
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
