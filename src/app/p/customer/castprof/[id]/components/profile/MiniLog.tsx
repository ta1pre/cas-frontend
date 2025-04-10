import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useBlogPosts } from "../../api/useBlogPosts";
import { useParams } from "next/navigation";
import { styled } from "@mui/material/styles";

// スタイル付きのコンポーネント
const BlogGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "16px",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  },
}));

const BlogCard = styled(Box)(({ theme }) => ({
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #f8e5ee",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
  },
}));

const BlogImage = styled("img")({
  width: "100%",
  height: "180px",
  objectFit: "cover",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const BlogOverlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(5px)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
});

const BlogContent = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  padding: "24px",
  maxWidth: "90%",
  maxHeight: "80vh",
  overflow: "auto",
  position: "relative",
  [theme.breakpoints.up("md")]: {
    maxWidth: "600px",
  },
}));

const CloseButton = styled(Button)({
  position: "fixed",
  top: "20px",
  right: "20px",
  minWidth: "40px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  color: "#d9467e",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  zIndex: 10000,
  "&:hover": {
    backgroundColor: "#fff",
  },
});

const EmptyState = styled(Box)({
  padding: "40px 20px",
  textAlign: "center",
  color: "#888",
});

export default function MiniLog() {
  const { id } = useParams();
  const castId = Number(id);
  const { posts, loading, error } = useBlogPosts(castId);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const openImage = (id: number) => {
    setExpandedId(id);
    document.body.classList.add("overflow-hidden"); // スクロール禁止
  };

  const closeImage = () => {
    setExpandedId(null);
    document.body.classList.remove("overflow-hidden"); // スクロール復活
  };

  useEffect(() => {
    return () => document.body.classList.remove("overflow-hidden"); // クリーンアップ
  }, []);

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#f472b6" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <Typography variant="body1">
        まだブログ投稿がありません。
        </Typography>
      </EmptyState>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState>
        <Typography variant="body1">
          まだブログ投稿がありません。
        </Typography>
      </EmptyState>
    );
  }

  const expandedPost = expandedId !== null ? posts.find(post => post.id === expandedId) : null;

  return (
    <Box sx={{ p: 2 }}>
      {/* ブログ投稿グリッド */}
      <BlogGrid>
        {posts.map((post) => (
          <BlogCard key={post.id} onClick={() => openImage(post.id)}>
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <BlogImage
                src={post.photo_url || "/images/placeholder.jpg"}
                alt={`ブログ ${post.id}`}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "8px 12px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  color: "white",
                }}
              >
                <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                  {formatDate(post.created_at)}
                </Typography>
              </Box>
            </Box>
          </BlogCard>
        ))}
      </BlogGrid>

      {/* 拡大表示オーバーレイ */}
      {expandedId !== null && expandedPost && (
        <BlogOverlay
          onClick={closeImage}
          sx={{ opacity: 1 }}
        >
          <BlogContent
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <img
              src={expandedPost.photo_url || "/images/placeholder.jpg"}
              alt={`ブログ ${expandedPost.id}`}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
            
            <Typography variant="caption" sx={{ display: "block", color: "#888" }}>
              {formatDate(expandedPost.created_at)}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                color: "#333",
                fontSize: "1rem"
              }}
            >
              {expandedPost.body}
            </Typography>
            
            <CloseButton onClick={closeImage}>
              ✕
            </CloseButton>
          </BlogContent>
        </BlogOverlay>
      )}
    </Box>
  );
}
