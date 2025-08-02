"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Settings } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Box>
        {/* Coming Soon */}
        <Card
          elevation={0}
          sx={{
            backgroundColor: "white",
            border: "1px solid #f1f5f9",
            borderRadius: 3,
            textAlign: "center",
            py: 8,
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#f3e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Settings size={40} color="#a855f7" />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}
            >
              Settings Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              User settings and preferences will be available here
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
