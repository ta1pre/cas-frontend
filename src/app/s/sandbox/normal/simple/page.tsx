'use client';

import React, { useEffect, Suspense } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '@/hooks/useAuth';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function SimpleNormalPageContent() {
  const { handleLogin, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #FF80AB 0%, #FF4081 50%, #D500F9 100%)"

      }}
    >
      {/* 中央のコンテンツエリア */}
      <Container
        maxWidth="sm"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2, // 各要素の間隔を統一
        }}
      >
        {/* ロゴ */}
        <Image src="/images/common/logo2.png" alt="Logo" width={80} height={0} priority className="object-contain" />

        {/* キャッチコピー */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold", 
            px: 3, 
            maxWidth: 360, 
            opacity: 0.95, 
            lineHeight: 1.6,
            textAlign: "left",
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              display: "inline-flex", 
              alignItems: "baseline",
            }}
          >
            <Box 
              component="span"
              sx={{ 
                fontSize: "1.5rem", 
                fontWeight: "bold", 
                color: "",
                opacity: 1,
              }}
            >
              Cas
            </Box>
            <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",
                opacity: 0.9,
                ml: 0.3,
                verticalAlign: "middle",
              }}
            >
              (キャス)
            </Box>
            <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",  
                opacity: 0.9,        
                ml: 0.5,
                verticalAlign: "middle",
              }}
            >
              は
            </Box>
          </Box>
          <br />
          <Box 
            component="span" 
            sx={{  
              fontSize: "1.5rem", 
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "baseline",
              mt: 0.5,
            }}
          >
            かわいい女の子専門
            <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",  
                opacity: 0.9,        
                ml: 0.5,
                verticalAlign: "middle",
              }}
            >
              の
            </Box>
          </Box>
          <br />
          <Box 
            component="span"
            sx={{ 
              display: "inline-flex", 
              alignItems: "baseline",
              mt: 0.5,
            }}
          >
            キャスト派遣
            <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",  
                opacity: 0.9,        
                ml: 0.5,
                verticalAlign: "middle",
              }}
            >
              アプリ
            </Box>
          </Box>
        </Typography>

        {/* 新規会員登録ボタン */}
        <Button
          variant="contained"
          onClick={() => handleLogin('line')} 
          disabled={loading} 
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            borderRadius: "50px",
            padding: "14px 60px",
            fontSize: "1.2rem",
            minWidth: "280px",
            textTransform: "none",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            transition: "all 0.3s ease-in-out",
            mt: 6,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            },
          }}
        >
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            {loading ? "ログイン中..." : "新規会員登録"}
          </Box>
          <ArrowForwardIcon sx={{ position: "absolute", right: 20 }} />
        </Button>

        {/* ボタン下の補足文 */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0 }}>
          <InfoIcon sx={{ color: "#FF80AB", fontSize: "1.2rem" }} />
          <Typography sx={{ fontSize: "0.9rem", opacity: 0.8, textAlign: "center" }}>
            アプリの利用は、
            <Box component="span" sx={{ color: "", fontWeight: "bold" }}>ずっと無料！</Box>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

// メインのページコンポーネント
export default function SimpleNormalPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>🔄 読み込み中...</p></div>}>
      <SimpleNormalPageContent />
    </Suspense>
  );
}
