"use client";

import React from "react";
import { Button } from "@mui/material";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function RecordButton() {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      router.push("/dashboard/record");
    } else {
      router.push("/auth/login?returnTo=/dashboard/record");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      startIcon={<Zap size={18} />}
      sx={{
        backgroundColor: "#a855f7",
        color: "white",
        fontWeight: 600,
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#9333ea",
        },
      }}
    >
      Start Recording
    </Button>
  );
}
