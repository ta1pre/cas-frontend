"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Stack } from "@mui/material";

const CONTENT_IDS = [
  "2p5du7plkq8",
  "1jd--tbx1d",
  "38etdezud"
];
const API_URL = "https://23t441tj5w.microcms.io/api/v1/static";
const API_KEY = "znTrSMC5Y4KxNITfqJnRjmRWB85KTjJtPg5b";

type Article = {
  id: string;
  title: string;
};

export default function MicrocmsFooter() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const results = await Promise.all(
          CONTENT_IDS.map(async (id) => {
            const res = await fetch(`${API_URL}/${id}`, {
              headers: { "X-MICROCMS-API-KEY": API_KEY },
              cache: "no-store"
            });
            if (!res.ok) return null;
            const data = await res.json();
            return { id, title: data.title };
          })
        );
        setArticles(results.filter(Boolean) as Article[]);
      } catch (e) {
        setArticles([]);
      }
    }
    fetchArticles();
  }, []);

  return (
    <Box component="footer" sx={{
      background: "transparent",
      py: 2,
      mt: 8,
      borderTop: "none"
    }}>
      <Stack direction="column" spacing={0.5} alignItems="center">
        {articles.map((a) => (
          <Link key={a.id} href={`/docs/${a.id}`} passHref legacyBehavior>
            <Box
              component="a"
              sx={{ color: "#222", textDecoration: "underline", fontWeight: 400, fontSize: 14 }}
            >
              {a.title}
            </Box>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
