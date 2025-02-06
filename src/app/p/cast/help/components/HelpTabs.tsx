import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { CategorySection } from "./CategorySection";
import { HelpArticle } from "../hooks/useHelpData";

interface HelpTabsProps {
  normalHelpArticles: HelpArticle[];
  faqArticles: HelpArticle[];
}

export function HelpTabs({ normalHelpArticles, faqArticles }: HelpTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: 0 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="ヘルプ情報" />
        <Tab label="Q&A" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {tabIndex === 0 && <CategorySection sectionTitle="ヘルプ情報" articles={normalHelpArticles} />}
        {tabIndex === 1 && <CategorySection sectionTitle="Q&A" articles={faqArticles} />}
      </Box>
    </Box>
  );
}
