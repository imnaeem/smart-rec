"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Box, Typography, Card, CardContent } from "@mui/material";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { useAuth } from "@/contexts/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.push(returnTo);
    }
  }, [user, router, returnTo]);

  const handleSignupSuccess = () => {
    router.push(returnTo);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0e7ff 0%, #fef3ff 50%, #f0f9ff 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              mb: 2,
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            Join thousands of creators using SmartRec
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            border: "1px solid #f1f5f9",
            boxShadow: "0px 20px 40px -8px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <SignupForm onSuccess={handleSignupSuccess} />

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  href={`/auth/login${
                    returnTo !== "/dashboard"
                      ? `?returnTo=${encodeURIComponent(returnTo)}`
                      : ""
                  }`}
                  style={{
                    color: "#a855f7",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box textAlign="center" mt={4}>
          <Link
            href="/"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            ← Back to home
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
