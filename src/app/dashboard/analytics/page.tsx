"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  Video,
  Eye,
  Clock,
  HardDrive,
  Share,
  Globe,
  BarChart3,
  Calendar,
  Award,
  Activity,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useAuth } from "@/contexts/auth-context";

interface AnalyticsData {
  overview: {
    totalRecordings: number;
    totalViews: number;
    totalDuration: number;
    totalSize: number;
    totalShares: number;
    publicRecordings: number;
  };
  viewsTimeline: Array<{ date: string; views: number }>;
  qualityStats: Record<string, number>;
  recordingsByMonth: Array<{ month: string; count: number }>;
  topRecordings: Array<{
    id: string;
    title: string;
    views: number;
    duration: number;
    createdAt: string;
  }>;
}

interface ModernStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function ModernStatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  trend,
}: ModernStatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${gradient})`,
        borderRadius: 4,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50% 0 0 50%",
          transform: "translateX(30%)",
        },
      }}
    >
      <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              size: 22,
              color: "white",
            })}
          </Box>
          {trend && (
            <Chip
              label={`${trend.isPositive ? "+" : ""}${trend.value}%`}
              size="small"
              sx={{
                backgroundColor: trend.isPositive
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(239,68,68,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 0.5,
            lineHeight: 1.1,
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.875rem",
            mb: 0.25,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.75rem",
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface ModernLineChartProps {
  data: Array<{ label: string; value: number }>;
  color: string;
  title: string;
}

function ModernLineChart({ data, color, title }: ModernLineChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{
    index: number;
    x: number;
    y: number;
    value: number;
    date: string;
  } | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <Card
      elevation={0}
      sx={{
        background: "white",
        borderRadius: 4,
        border: "1px solid #f1f5f9",
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 4, height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={24} color={color} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1a1a1a",
                fontSize: "1.25rem",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Last 30 days performance
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 220, position: "relative", pl: 2 }}>
          {/* Y-axis labels */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 10,
              height: 160,
              display: "flex",
              flexDirection: "column-reverse",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: 30,
            }}
          >
            {[0, 25, 50, 75, 100].map((percentage) => {
              const value = Math.round(minValue + (range * percentage) / 100);
              return (
                <Typography
                  key={percentage}
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: "#9ca3af",
                    fontWeight: 500,
                  }}
                >
                  {value}
                </Typography>
              );
            })}
          </Box>

          {/* Chart Container */}
          <Box sx={{ height: 160, position: "relative", ml: 4 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Grid lines */}
              {[20, 40, 60, 80].map((percentage) => (
                <line
                  key={percentage}
                  x1="0"
                  y1={percentage}
                  x2="100"
                  y2={percentage}
                  stroke="#f1f5f9"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Modern Bar Chart */}
              {data.map((point, index) => {
                const barWidth = 85 / data.length;
                const x = 5 + (index * 85) / data.length;
                const height =
                  range > 0 ? ((point.value - minValue) / range) * 75 : 0;
                const y = 85 - height;
                const isHovered = hoveredBar?.index === index;

                return (
                  <g key={index}>
                    {/* Invisible hover area */}
                    <rect
                      x={x - barWidth * 0.2}
                      y={0}
                      width={barWidth}
                      height={100}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const svgRect = e.currentTarget
                          .closest("svg")
                          ?.getBoundingClientRect();
                        if (svgRect) {
                          setHoveredBar({
                            index,
                            x: rect.left + rect.width / 2 - svgRect.left,
                            y: rect.top - svgRect.top,
                            value: point.value,
                            date: new Date(point.label).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            ),
                          });
                        }
                      }}
                    />

                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth * 0.6}
                      height={height}
                      fill={color}
                      rx={barWidth * 0.05}
                      opacity={isHovered ? 1 : 0.9}
                      style={{
                        transition: "opacity 0.2s ease",
                        filter: isHovered
                          ? `drop-shadow(0 4px 8px ${color}40)`
                          : "none",
                      }}
                    />

                    {/* Highlight */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth * 0.6}
                      height={Math.max(2, height * 0.3)}
                      fill={
                        isHovered
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(255,255,255,0.3)"
                      }
                      rx={barWidth * 0.05}
                      style={{ transition: "fill 0.2s ease" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredBar && (
              <Box
                sx={{
                  position: "absolute",
                  left: hoveredBar.x,
                  top: hoveredBar.y - 60,
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  pointerEvents: "none",
                  zIndex: 1000,
                  whiteSpace: "nowrap",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    border: "4px solid transparent",
                    borderTopColor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem" }}
                  >
                    {hoveredBar.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, fontSize: "0.8rem" }}
                  >
                    {hoveredBar.value} views
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* X-axis labels */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              ml: 4,
              pr: 1,
              height: 25,
              alignItems: "center",
            }}
          >
            {data
              .filter((_, index) => index % Math.ceil(data.length / 5) === 0)
              .map((point, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {new Date(point.label).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface CompactStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function CompactStatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: CompactStatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        background: "white",
        borderRadius: 3,
        border: "1px solid #f1f5f9",
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: color,
          boxShadow: `0 8px 25px ${color}20`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, textAlign: "center" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1.5,
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            size: 20,
            color: color,
          })}
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 800,
            color: "#1a1a1a",
            mb: 0.25,
            fontSize: "1.4rem",
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#64748b",
            fontSize: "0.8rem",
            mb: subtitle ? 0.25 : 0,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontSize: "0.7rem",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);



  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const authToken = await user.getIdToken();
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Calculate additional insights
  const avgDuration = analyticsData
    ? Math.round(
        analyticsData.overview.totalDuration /
          (analyticsData.overview.totalRecordings || 1)
      )
    : 0;

  const bestDay = analyticsData?.viewsTimeline.reduce(
    (best, current) => (current.views > best.views ? current : best),
    { date: "", views: 0 }
  );

  const topRecording = analyticsData?.topRecordings[0];
  const thisMonthRecordings =
    analyticsData?.recordingsByMonth.find((m) =>
      m.month.includes(
        new Date().toLocaleDateString("en-US", { month: "short" })
      )
    )?.count || 0;

  if (authLoading || loading) {
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

  if (error) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {error}
        </Alert>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No analytics data available.
        </Alert>
      </DashboardLayout>
    );
  }

  const viewsChartData = analyticsData.viewsTimeline.map((item) => ({
    label: item.date,
    value: item.views,
  }));

  return (
    <DashboardLayout>
      <Box sx={{ pb: 4 }}>
        {/* Main Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <ModernStatCard
            title="Total Recordings"
            value={analyticsData.overview.totalRecordings}
            subtitle="videos created"
            icon={<Video />}
            gradient="#a855f7, #d946ef"
            trend={{ value: 12, isPositive: true }}
          />
          <ModernStatCard
            title="Total Views"
            value={analyticsData.overview.totalViews}
            subtitle="across all content"
            icon={<Eye />}
            gradient="#10b981, #059669"
            trend={{ value: 8, isPositive: true }}
          />
          <ModernStatCard
            title="Storage Used"
            value={formatFileSize(analyticsData.overview.totalSize)}
            subtitle="total file size"
            icon={<HardDrive />}
            gradient="#f59e0b, #d97706"
          />
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Views Chart */}
          <ModernLineChart
            data={viewsChartData}
            color="#10b981"
            title="Views Analytics"
          />

          {/* Top Recording Card */}
          <Card
            elevation={0}
            sx={{
              background: "white",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
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
                  <Award size={20} color="#ef4444" />
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "#1a1a1a",
                      fontSize: "1rem",
                    }}
                  >
                    Top Performing
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    Most viewed recordings
                  </Typography>
                </Box>
              </Box>

              <Stack
                spacing={2}
                sx={{ height: "calc(100% - 90px)", overflow: "auto" }}
              >
                {analyticsData.topRecordings
                  .slice(0, 3)
                  .map((recording, index) => (
                    <Box
                      key={recording.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2.5,
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: "#a855f7",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        #{index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mb: 0.25,
                            color: "#1a1a1a",
                            fontSize: "0.8rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {recording.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontSize: "0.7rem" }}
                        >
                          {formatDuration(recording.duration)}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${recording.views} views`}
                        size="small"
                        sx={{
                          backgroundColor: "#ddd6fe",
                          color: "#7c3aed",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  ))}
                {analyticsData.topRecordings.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Activity
                      size={32}
                      color="#9ca3af"
                      style={{ marginBottom: 16 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#9ca3af", fontSize: "0.875rem" }}
                    >
                      No recordings with views yet
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Bottom Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          <CompactStatCard
            title="Average Duration"
            value={formatDuration(avgDuration)}
            icon={<Clock />}
            color="#f59e0b"
            subtitle="per recording"
          />
          <CompactStatCard
            title="Best Performing Day"
            value={bestDay?.views || 0}
            icon={<Calendar />}
            color="#8b5cf6"
            subtitle={
              bestDay?.date
                ? new Date(bestDay.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"
            }
          />
          <CompactStatCard
            title="Top Views"
            value={topRecording?.views || 0}
            icon={<TrendingUp />}
            color="#10b981"
            subtitle="single recording"
          />
          <CompactStatCard
            title="This Month"
            value={thisMonthRecordings}
            icon={<Users />}
            color="#06b6d4"
            subtitle="new recordings"
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
