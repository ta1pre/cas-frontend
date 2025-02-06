'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';

export default function SandboxPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
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
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* 🎥 背景動画 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/sandbox/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 📌 どセンターに配置した黒地のボタン (矢印削除) */}
      <Box className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          variant="contained"
          onClick={() => console.log('Button Clicked')}
          className="text-white text-lg font-semibold tracking-wide transition-all duration-300"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '8px',
            padding: '14px 50px',
            fontSize: '1.2rem',
            minWidth: '200px', // ✅ 横幅を広げる
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'none', // ✅ 大文字変換を防ぐ (MUI のデフォルト)
            '&:hover': {
              backgroundColor: '#333', // ✅ ホバー時に少し明るく
            },
          }}
        >
          ログイン
        </Button>
      </Box>
    </div>
  );
}
