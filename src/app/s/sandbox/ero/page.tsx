'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '@/hooks/useAuth'; // `useAuth()` をインポート
import Cookies from 'js-cookie'; // クッキー操作用のライブラリをインポート

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function EroPageContent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { handleLogin, loading } = useAuth(); // Hooks をコンポーネント内で呼び出す

  useEffect(() => {
    // クッキーを設定 - customer:delicasを設定
    Cookies.set('StartPage', 'customer:delicas', { path: '/' });
    console.log('StartPage cookie set to customer:delicas');
    
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => console.error('🔴 Video autoplay failed:', error));
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 🖼️ 背景画像 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/sandbox/bg.jpg')", // ✅ ここを変更
          backgroundSize: "cover",  // ✅ 画像を画面全体にフィット
          backgroundPosition: "center",  // ✅ 中央配置
          backgroundRepeat: "no-repeat",  // ✅ 繰り返しなし
        }}
      />

      {/* 🔥 半透明のオーバーレイ */}
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0, 0, 0, 0.4)" }} />

      {/* 📌 中央のコンテンツエリア */}
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
          gap: 2, // ✅ 各要素の間隔を統一
        }}
      >
        {/* 🌟 ロゴ */}
        <Image src="/images/common/logo.png" alt="Logo" width={50} height={50} priority className="object-contain" />

        {/* 📝 タイトル */}
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
                color: "#FFFFFF",
                opacity: 1,
              }}
            >
              PreCas
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
              (プレキャス)
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
              color: "#FF80AB", 
              fontSize: "1.5rem", 
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "baseline",
              mt: 0.5,
            }}
          >
            えっちな女の子
            <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",  
                opacity: 0.9,        
                ml: 0,
                verticalAlign: "middle",
              }}
            >
            専門
            </Box>
          </Box>
                      <Box 
              component="span" 
              sx={{ 
                fontSize: "1.2rem",  
                fontWeight: "bold",  
                opacity: 0.9,        
                ml: 0.2,
                verticalAlign: "middle",
              }}
            >
            の
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

        {/* 🟢 新規会員登録ボタン（ログイン機能を追加） */}
        <Button
          variant="contained"
          onClick={() => handleLogin('line')} // ✅ ログイン処理を適用
          disabled={loading} // ✅ ログイン中はクリック不可
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            borderRadius: "50px", // ✅ 角丸を半円に
            padding: "14px 60px",
            fontSize: "1.2rem",
            minWidth: "280px", // ✅ ボタンをさらに横長に
            textTransform: "none",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            '&:hover': {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ mr: 1 }}>LINE認証でログイン</Box>
            <ArrowForwardIcon fontSize="small" />
          </Box>
        </Button>

        {/* ℹ️ 注意書き */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mt: 2,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "8px 16px",
            borderRadius: "4px",
            maxWidth: "280px",
          }}
        >
          <InfoIcon sx={{ fontSize: 18, mr: 1, opacity: 0.7 }} />
          <Typography variant="caption" sx={{ opacity: 0.7, textAlign: "left" }}>
            ログインすると利用規約とプライバシーポリシーに同意したことになります
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

// メインのページコンポーネント
export default function EroPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>🔄 読み込み中...</p></div>}>
      <EroPageContent />
    </Suspense>
  );
}
