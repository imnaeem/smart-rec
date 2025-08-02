"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { blogPosts, categories } from "@/lib/data/blog-posts";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  const featuredPost = blogPosts.find((post) => post.featured);
  const allRegularPosts = blogPosts.filter((post) => !post.featured);

  // Filter posts based on selected category
  const regularPosts =
    selectedCategory === "All Posts"
      ? allRegularPosts
      : allRegularPosts.filter((post) => post.category === selectedCategory);

  // All cards same size - 3 per row

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
          <Container maxWidth="xl">
            <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
              <Chip
                icon={<Sparkles size={16} />}
                label="✍️ SmartRec Blog"
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
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Insights, Tips & Stories
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
                Stay updated with the latest trends in screen recording, content
                creation, and productivity tips from our team.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Featured Post */}
        {featuredPost && (
          <Box py={{ xs: 4, md: 6 }} sx={{ backgroundColor: "white" }}>
            <Container maxWidth="xl">
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: "#1a1a1a",
                }}
              >
                Featured Post
              </Typography>

              <Card
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #f1f5f9",
                  borderRadius: 3,
                  transition: "all 0.3s ease-in-out",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 24px -8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      p: { xs: 4, md: 6 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Stack spacing={3}>
                      <Box>
                        <Chip
                          label={featuredPost.category}
                          sx={{
                            backgroundColor: `${featuredPost.categoryColor}20`,
                            color: featuredPost.categoryColor,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h3"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: "#1a1a1a",
                            fontSize: { xs: "1.75rem", md: "2.25rem" },
                            lineHeight: 1.2,
                          }}
                        >
                          {featuredPost.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#6b7280",
                            lineHeight: 1.7,
                            mb: 3,
                            fontSize: "1.125rem",
                          }}
                        >
                          {featuredPost.excerpt}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: featuredPost.categoryColor,
                            fontSize: "1rem",
                            fontWeight: 700,
                          }}
                        >
                          {featuredPost.authorAvatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            {featuredPost.author}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Calendar size={14} color="#6b7280" />
                              <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                              >
                                {featuredPost.date}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Clock size={14} color="#6b7280" />
                              <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                              >
                                {featuredPost.readTime}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>

                      <Button
                        component={Link}
                        href={`/blog/${featuredPost.slug}`}
                        variant="contained"
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                          backgroundColor: featuredPost.categoryColor,
                          color: "white",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          alignSelf: "flex-start",
                          "&:hover": {
                            backgroundColor: featuredPost.categoryColor,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Read More
                      </Button>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      flex: { xs: "none", md: "0 0 400px" },
                      height: { xs: "200px", md: "auto" },
                      minHeight: { md: "350px" },
                      background: `linear-gradient(135deg, ${featuredPost.categoryColor}20, ${featuredPost.categoryColor}10)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "4rem",
                    }}
                  >
                    {featuredPost.image}
                  </Box>
                </Box>
              </Card>
            </Container>
          </Box>
        )}

        {/* Categories Filter */}
        <Box py={{ xs: 3, md: 4 }} sx={{ backgroundColor: "#f8fafc" }}>
          <Container maxWidth="xl">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                overflowX: "auto",
                pt: 1, // Add top padding to prevent clipping on hover animation
                pb: { xs: 2, sm: 1 },
              }}
            >
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  label={`${category.name} (${category.count})`}
                  variant={
                    selectedCategory === category.name ? "filled" : "outlined"
                  }
                  clickable
                  onClick={() => setSelectedCategory(category.name)}
                  sx={{
                    backgroundColor:
                      selectedCategory === category.name
                        ? category.color
                        : "transparent",
                    color:
                      selectedCategory === category.name
                        ? "white"
                        : category.color,
                    borderColor: category.color,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        selectedCategory === category.name
                          ? category.color
                          : `${category.color}20`,
                      transform: "translateY(-2px)",
                      zIndex: 10, // Ensure chip appears above other elements during animation
                      boxShadow: "0px 4px 8px -2px rgba(0,0,0,0.1)", // Add subtle shadow for depth
                    },
                    whiteSpace: "nowrap",
                  }}
                />
              ))}
            </Stack>
          </Container>
        </Box>

        {/* Blog Posts Grid */}
        <Box py={{ xs: 6, md: 8 }} sx={{ backgroundColor: "white" }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              {selectedCategory === "All Posts"
                ? "Latest Posts"
                : `${selectedCategory} Posts`}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 4,
              }}
            >
              {regularPosts.map((post) => (
                <Card
                  key={post.slug}
                  elevation={0}
                  sx={{
                    height: "100%",
                    backgroundColor: "white",
                    border: "1px solid #f1f5f9",
                    borderRadius: 3,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0px 20px 40px -8px rgba(0,0,0,0.1)",
                      borderColor: post.categoryColor,
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        height: "150px",
                        background: `linear-gradient(135deg, ${post.categoryColor}20, ${post.categoryColor}10)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3rem",
                        borderRadius: "12px 12px 0 0",
                      }}
                    >
                      {post.image}
                    </Box>

                    <Box sx={{ p: 4 }}>
                      {/* Category Chip */}
                      <Chip
                        label={post.category}
                        sx={{
                          backgroundColor: `${post.categoryColor}20`,
                          color: post.categoryColor,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          mb: 2,
                          alignSelf: "flex-start",
                        }}
                      />

                      {/* Title */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "#1a1a1a",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.title}
                      </Typography>

                      {/* Excerpt */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 3,
                        }}
                      >
                        {post.excerpt}
                      </Typography>

                      {/* Author Info */}
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 3 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: post.categoryColor,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                          }}
                        >
                          {post.authorAvatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#374151",
                              display: "block",
                            }}
                          >
                            {post.author}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Calendar size={12} color="#6b7280" />
                              <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                              >
                                {post.date}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#6b7280" }}
                            >
                              •
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Clock size={12} color="#6b7280" />
                              <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                              >
                                {post.readTime}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Button */}
                      <Button
                        component={Link}
                        href={`/blog/${post.slug}`}
                        variant="outlined"
                        endIcon={<ArrowRight size={14} />}
                        sx={{
                          borderColor: post.categoryColor,
                          color: post.categoryColor,
                          fontWeight: 600,
                          py: 1,
                          borderRadius: 2,
                          textTransform: "none",
                          alignSelf: "flex-start",
                          "&:hover": {
                            backgroundColor: `${post.categoryColor}10`,
                            borderColor: post.categoryColor,
                          },
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      </main>
      <Footer />
    </>
  );
}
