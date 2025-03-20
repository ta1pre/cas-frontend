'use client';

import React from "react";
import { useHelpData } from "./hooks/useHelpData";
import { HelpTabs } from "./components/HelpTabs";
import { Box, CircularProgress, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // ✅ アイコン追加

export default function HelpPage() {
  const { helpItems, error, loading } = useHelpData();

  if (loading) return <Box sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">❌ {error}</Typography>;

  const normalHelpArticles = helpItems.filter(article => article.category.id === "guest");
  const faqArticles = helpItems.filter(article => article.category.id === "guest_q");

  return (
    <Box sx={{ maxWidth: "600px", mx: "auto", p: 4 }}>
      {/* ✅ 統一感のあるタイトルデザイン */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, color: "gray.800" }}>
        <HelpOutlineIcon fontSize="large" sx={{ color: "blue.600", mr: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          ヘルプ
        </Typography>
      </Box>

      <HelpTabs normalHelpArticles={normalHelpArticles} faqArticles={faqArticles} />
    </Box>
  );
}
