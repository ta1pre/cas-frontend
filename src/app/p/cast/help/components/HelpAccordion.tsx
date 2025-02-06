// p/cast/help/components/HelpAccordion.tsx
import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HelpArticle } from "../hooks/useHelpData";

interface HelpAccordionProps {
  articles: HelpArticle[];
}

export function HelpAccordion({ articles }: HelpAccordionProps) {
  return (
    <div>
      {articles.length === 0 ? (
        <Typography variant="body2">記事がありません</Typography>
      ) : (
        articles.map((article) => (
          <Accordion key={article.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: "bold" }}>{article.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
}
