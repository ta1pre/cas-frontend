// p/cast/help/components/CategorySection.tsx
import React from "react";
import { HelpArticle } from "../hooks/useHelpData";
import { HelpAccordion } from "./HelpAccordion";
import { Typography } from "@mui/material";

interface CategorySectionProps {
  sectionTitle: string;
  articles: HelpArticle[];
}

export function CategorySection({ sectionTitle, articles }: CategorySectionProps) {
  const normalArticles = articles.filter((article) => !article.adult);
  const adultArticles = articles.filter((article) => article.adult);

  return (
    <div>
      <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
        {sectionTitle}
      </Typography>

      {normalArticles.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>通常</Typography>
          <HelpAccordion articles={normalArticles} />
        </>
      )}

      {adultArticles.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold", color: "red" }}>🔞 アダルト</Typography>
          <HelpAccordion articles={adultArticles} />
        </>
      )}
    </div>
  );
}
