import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Box, Typography, Container } from "@mui/material";
import { JSX } from 'react'; // JSX 型をインポート

const API_URL = "https://23t441tj5w.microcms.io/api/v1/static";
const API_KEY = "znTrSMC5Y4KxNITfqJnRjmRWB85KTjJtPg5b";

async function fetchArticle(contentId: string) {
  const res = await fetch(`${API_URL}/${contentId}`,
    { headers: { "X-MICROCMS-API-KEY": API_KEY }, cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function DocPage({ params }: { params: { contentId: string } }): Promise<JSX.Element> {
  const article = await fetchArticle(params.contentId);
  if (!article) return notFound();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Link href="/" passHref legacyBehavior>
          <Box component="a" sx={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/images/common/logo.png" alt="Cas Logo" width={60} height={60} />
          </Box>
        </Link>
      </Box>
      <Typography variant="h4" color="#E91E63" fontWeight="bold" mb={2}>
        {article.title}
      </Typography>
      <Box sx={{ color: '#444', fontSize: '1.1rem', lineHeight: 1.8 }}
           dangerouslySetInnerHTML={{ __html: article.body || "" }}
      />
    </Container>
  );
}
