"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Camera, Save, User, Bell, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useAuth } from "@/contexts/auth-context";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile settings
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [defaultRecordingPrivacy, setDefaultRecordingPrivacy] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const storage = getStorage();
      const imageRef = ref(
        storage,
        `profile-pictures/${user.uid}/${Date.now()}_${file.name}`
      );

      console.log("📸 Uploading profile image...");
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("📸 Image uploaded successfully:", downloadURL);
      setPhotoURL(downloadURL);
      setSuccess("Profile image uploaded successfully!");
    } catch (err) {
      console.error("📸 Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Update Firebase user profile
      await user.updateProfile({
        displayName: displayName.trim(),
        photoURL: photoURL,
      });

      // Force refresh the user data
      await user.reload();

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={48} sx={{ color: "#a855f7" }} />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <Alert severity="error">Please log in to access settings.</Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", pb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              mb: 1,
            }}
          >
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account preferences and privacy settings
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Profile Settings */}
        <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #a855f720, #a855f710)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={20} color="#a855f7" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal information and profile picture
                </Typography>
              </Box>
            </Box>

            <Stack spacing={3}>
              {/* Profile Picture */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={photoURL}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "4px solid #f8fafc",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {displayName
                      ? displayName[0].toUpperCase()
                      : user.email?.[0].toUpperCase() || "U"}
                  </Avatar>
                  {uploading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                      }}
                    >
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Profile Picture
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={
                      uploading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Camera size={16} />
                      )
                    }
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      "&:hover": {
                        borderColor: "#a855f7",
                        color: "#a855f7",
                      },
                    }}
                  >
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    Max size: 5MB. Supports JPG, PNG, GIF
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Form Fields */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
              >
                <TextField
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  label="Email Address"
                  value={email}
                  disabled
                  fullWidth
                  variant="outlined"
                  helperText="Email cannot be changed"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={loading || uploading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Save size={16} />
                    )
                  }
                  sx={{
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    "&:hover": {
                      background: "linear-gradient(135deg, #9333ea, #6d28d9)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #10b98120, #10b98110)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={20} color="#10b981" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure how you receive notifications
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    color="success"
                  />
                }
                label="Email notifications for new recordings and shares"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={desktopNotifications}
                    onChange={(e) => setDesktopNotifications(e.target.checked)}
                    color="success"
                  />
                }
                label="Desktop notifications for new messages and activity"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #ef444420, #ef444410)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={20} color="#ef4444" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Privacy & Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Control your privacy and default recording settings
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.checked)}
                    color="error"
                  />
                }
                label="Make profile visible to other users"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={defaultRecordingPrivacy}
                    onChange={(e) =>
                      setDefaultRecordingPrivacy(e.target.checked)
                    }
                    color="error"
                  />
                }
                label="Make new recordings public by default"
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
