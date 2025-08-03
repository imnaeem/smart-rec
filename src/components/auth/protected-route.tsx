"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/contexts/auth-context";
import { Loader } from "../ui/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?returnTo=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
