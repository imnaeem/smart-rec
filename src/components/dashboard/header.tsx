"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Video, User, Settings, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get page-specific title and description
  const getPageInfo = () => {
    switch (pathname) {
      case "/dashboard":
        return {
          title: "Dashboard",
          description: "Ready to create something amazing today?",
        };
      case "/dashboard/record":
        return {
          title: "New Recording",
          description: "Configure your recording settings and start capturing",
        };
      case "/dashboard/recordings":
        return {
          title: "My Recordings",
          description: "Manage and organize all your recordings",
        };
      case "/dashboard/analytics":
        return {
          title: "Analytics",
          description: "Track your recording performance and engagement",
        };
      case "/dashboard/settings":
        return {
          title: "Settings",
          description: "Manage your account and recording preferences",
        };
      default:
        return {
          title: `Good morning, ${
            user?.displayName?.split(" ")[0] || "Creator"
          }!`,
          description: "Ready to create something amazing today?",
        };
    }
  };

  const { title, description } = getPageInfo();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    handleMenuClose();
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        height: 80,
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1a1a1a",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Quick Record Button */}
        <Button
          variant="contained"
          startIcon={<Video size={18} />}
          onClick={() => router.push("/dashboard/record")}
          sx={{
            backgroundColor: "#a855f7",
            color: "white",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            "&:hover": { backgroundColor: "#9333ea" },
          }}
        >
          Start Recording
        </Button>

        {/* Notifications */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          <Bell size={18} color="#6b7280" />
        </Box>

        {/* User Menu */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "#a855f7",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={handleMenuClick}
        >
          {user?.displayName?.[0] || user?.email?.[0] || "U"}
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{ mt: 1 }}
        >
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f1f5f9" }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.displayName || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Settings size={18} />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
