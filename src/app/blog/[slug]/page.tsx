"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Calendar, Clock, ArrowLeft, Share2, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blog-posts";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareText, setShareText] = useState("Share Article");

  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      // Try using Web Share API first (mobile devices)
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      // Fallback: Copy URL to clipboard
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareText("Copied!");
        setShareSuccess(true);

        // Reset button text after 2 seconds
        setTimeout(() => {
          setShareText("Share Article");
        }, 2000);
      } else {
        // If clipboard API is not available, show the URL for manual copying
        setShareSuccess(true);
      }
    } catch (error) {
      console.log("Error sharing:", error);
      // If clipboard API also fails, show the URL for manual copying
      setShareSuccess(true);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Article Header */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #e0e7ff 0%, #fef3ff 50%, #f0f9ff 100%)",
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Box mb={4}>
              <Button
                component={Link}
                href="/blog"
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  color: "#6b7280",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  },
                }}
              >
                Back to Blog
              </Button>
            </Box>

            <Stack spacing={4}>
              <Box>
                <Chip
                  label={post.category}
                  sx={{
                    backgroundColor: `${post.categoryColor}20`,
                    color: post.categoryColor,
                    fontWeight: 600,
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
                    fontWeight: 800,
                    color: "#1a1a1a",
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#525252",
                    lineHeight: 1.6,
                    fontSize: { xs: "1.125rem", md: "1.25rem" },
                  }}
                >
                  {post.excerpt}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: post.categoryColor,
                      fontSize: "1.25rem",
                      fontWeight: 700,
                    }}
                  >
                    {post.authorAvatar}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {post.author}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Calendar size={16} color="#6b7280" />
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          {post.date}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Clock size={16} color="#6b7280" />
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          {post.readTime}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>

                <Button
                  startIcon={
                    shareText === "Copied!" ? (
                      <Check size={16} />
                    ) : (
                      <Share2 size={16} />
                    )
                  }
                  variant="outlined"
                  onClick={handleShare}
                  sx={{
                    borderColor:
                      shareText === "Copied!" ? "#10b981" : post.categoryColor,
                    color:
                      shareText === "Copied!" ? "#10b981" : post.categoryColor,
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        shareText === "Copied!"
                          ? "#10b98110"
                          : `${post.categoryColor}10`,
                      borderColor:
                        shareText === "Copied!"
                          ? "#10b981"
                          : post.categoryColor,
                    },
                  }}
                >
                  {shareText}
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Article Content */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                maxWidth: "800px",
                mx: "auto",
                "& h2": {
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                },
                "& h3": {
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginTop: "1.5rem",
                  marginBottom: "0.75rem",
                },
                "& h4": {
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginTop: "1.25rem",
                  marginBottom: "0.5rem",
                },
                "& p": {
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  color: "#374151",
                  marginBottom: "1rem",
                },
                "& ul, & ol": {
                  marginBottom: "1rem",
                  paddingLeft: "1.5rem",
                },
                "& li": {
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  color: "#374151",
                  marginBottom: "0.5rem",
                },
                "& strong": {
                  fontWeight: 600,
                  color: "#1a1a1a",
                },
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Container>
        </Box>

        {/* Related Articles */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "#f8fafc" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: "#1a1a1a",
                textAlign: "center",
              }}
            >
              Continue Reading
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                component={Link}
                href="/blog"
                variant="contained"
                sx={{
                  backgroundColor: post.categoryColor,
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: post.categoryColor,
                    opacity: 0.9,
                  },
                }}
              >
                View All Articles
              </Button>
              <Button
                component={Link}
                href="/docs"
                variant="outlined"
                sx={{
                  borderColor: post.categoryColor,
                  color: post.categoryColor,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: `${post.categoryColor}10`,
                    borderColor: post.categoryColor,
                  },
                }}
              >
                Explore Documentation
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Share Success Snackbar */}
        <Snackbar
          open={shareSuccess}
          autoHideDuration={3000}
          onClose={() => setShareSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShareSuccess(false)}
            severity="success"
            sx={{
              backgroundColor: "#10b981",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            Article link copied to clipboard!
          </Alert>
        </Snackbar>
      </main>
      <Footer />
    </>
  );
}
