"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { Video, Menu, User } from "lucide-react";
import { RecordButton } from "@/components/ui/record-button";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 1, pb: 2 }}>
      <List sx={{ px: 2 }}>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 1.5,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: "#374151",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            href="/login"
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 1.5,
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemText
              primary="Sign In"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#374151",
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 2 }}>
          <Box sx={{ width: "100%" }} onClick={handleDrawerToggle}>
            <RecordButton />
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f1f5f9",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ justifyContent: "space-between", minHeight: 76, py: 2 }}
          >
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "#a855f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Video size={22} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#1f2937",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.025em",
                }}
              >
                SmartRec
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      component={Link}
                      href={item.href}
                      color="inherit"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        },
                        "&:hover": {
                          color: "#1f2937",
                          "&::before": {
                            opacity: 1,
                          },
                        },
                        "&:hover .nav-text": {
                          position: "relative",
                          zIndex: 1,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span className="nav-text">{item.name}</span>
                    </Button>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {user ? (
                    <Button
                      component={Link}
                      href="/dashboard"
                      color="inherit"
                      startIcon={<User size={16} />}
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        },
                        "&:hover": {
                          color: "#1f2937",
                          "&::before": {
                            opacity: 1,
                          },
                        },
                        "&:hover .nav-text": {
                          position: "relative",
                          zIndex: 1,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span className="nav-text">Dashboard</span>
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      href="/auth/login"
                      color="inherit"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        },
                        "&:hover": {
                          color: "#1f2937",
                          "&::before": {
                            opacity: 1,
                          },
                        },
                        "&:hover .nav-text": {
                          position: "relative",
                          zIndex: 1,
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span className="nav-text">Sign In</span>
                    </Button>
                  )}
                  <RecordButton />
                </Box>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    color: "#1f2937",
                  },
                }}
              >
                <Menu />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              top: 76,
              height: "calc(100vh - 76px)",
            },
          },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            top: 76,
            height: "calc(100vh - 76px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
