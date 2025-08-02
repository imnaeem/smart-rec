"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  Home,
  Video,
  FolderOpen,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Video, label: "New Recording", path: "/dashboard/record" },
  { icon: FolderOpen, label: "My Recordings", path: "/dashboard/recordings" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        backgroundColor: "white",
        borderRight: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#a855f7",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={18} color="white" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              fontSize: "1.2rem",
            }}
          >
            SmartRec
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "#f3e8ff" : "transparent",
                  color: isActive ? "#a855f7" : "#6b7280",
                  "&:hover": {
                    backgroundColor: isActive ? "#f3e8ff" : "#f8fafc",
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 40,
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Storage Usage */}
      <Box sx={{ p: 3, borderTop: "1px solid #f1f5f9" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Storage Used
        </Typography>
        <Box
          sx={{
            height: 6,
            backgroundColor: "#f1f5f9",
            borderRadius: 3,
            mb: 1,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "25%",
              backgroundColor: "#a855f7",
              borderRadius: 3,
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          250 MB of 1 GB used
        </Typography>
      </Box>
    </Box>
  );
}
