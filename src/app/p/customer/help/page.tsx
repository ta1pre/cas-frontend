// p/cast/help/page.tsx
'use client';

import React from "react";
import { useHelpData } from "./hooks/useHelpData";
import { HelpTabs } from "./components/HelpTabs";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function HelpPage() {
  const { helpItems, error, loading } = useHelpData();

  if (loading) return <Box sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">❌ {error}</Typography>;

  const normalHelpArticles = helpItems.filter(article => article.category.id === "guest");
  const faqArticles = helpItems.filter(article => article.category.id === "guest_q");

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", px: 0, py: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
        ヘルプ
      </Typography>

      <HelpTabs normalHelpArticles={normalHelpArticles} faqArticles={faqArticles} />
    </Box>
  );
}
