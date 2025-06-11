"use client";

import React, { useState } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait"; // 利用者
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural"; // キャスト
import { useSetupStorage } from "@/app/p/setup/hooks/storage/useSetupStorage";
import { setCookie } from "@/app/p/setup/utils/cookieUtils";

interface Props {
  onNextStep: (userType: "cast" | "customer") => void;
}

export default function UserTypeSelectionStep({ onNextStep }: Props) {
  const { getStorage, setStorage } = useSetupStorage();
  const [selected, setSelected] = useState<"cast" | "customer" | null>(
    (getStorage("user_type") as "cast" | "customer") || null
  );

  const handleSelect = (type: "cast" | "customer") => {
    setSelected(type);
    // 保存
    setStorage("user_type", type);
    // StartPage クッキーを仮設定 (キャストはデフォルト cas)
    const cookieVal = type === "cast" ? "cast:cas" : "customer";
    setCookie("StartPage", cookieVal, { path: "/" });
    onNextStep(type);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          bgcolor: "background.default",
          color: "text.primary",
          px: 3,
          py: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ユーザー種別を選択
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          後で変更はできません。
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 300 }}>
          <Button
            variant={selected === "cast" ? "contained" : "outlined"}
            startIcon={<FaceRetouchingNaturalIcon />}
            fullWidth
            onClick={() => handleSelect("cast")}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              borderColor: "#E91E63",
              color: selected === "cast" ? "#FFFFFF" : "#E91E63",
              bgcolor: selected === "cast" ? "#E91E63" : "transparent",
              "&:hover": {
                bgcolor: selected === "cast" ? "#C2185B" : "rgba(233,30,99,0.1)",
              },
            }}
          >
            キャスト
          </Button>

          <Button
            variant={selected === "customer" ? "contained" : "outlined"}
            startIcon={<PortraitIcon />}
            fullWidth
            onClick={() => handleSelect("customer")}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              borderColor: "#2196F3",
              color: selected === "customer" ? "#FFFFFF" : "#2196F3",
              bgcolor: selected === "customer" ? "#2196F3" : "transparent",
              "&:hover": {
                bgcolor: selected === "customer" ? "#1976D2" : "rgba(33,150,243,0.1)",
              },
            }}
          >
            利用者
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
