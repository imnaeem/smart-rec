import { Box, CircularProgress, Typography } from "@mui/material";

export const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={40} sx={{ color: "#a855f7" }} />
      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};
