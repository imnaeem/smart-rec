"use client";

import React from "react";
import { Box } from "@mui/material";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <Box
        sx={{ display: "flex", height: "100vh", backgroundColor: "#fafafa" }}
      >
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <DashboardHeader />
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 4,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
