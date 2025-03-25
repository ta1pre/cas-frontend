'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import DeliRecruitIntro from './components/DeliRecruitIntro';
import DeliRecruitDetail from './components/DeliRecruitDetail';
import DeliRecruitExample from './components/DeliRecruitExample';
import { Suspense } from 'react';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function DeliRecruitPageContent() {
  const { handleLogin, loading } = useAuth();
  const buttonAreaHeight = 160;

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* ロゴとタイトル */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 1, zIndex: 60 }}>
        <Image src="/images/common/logo.png" alt="Logo" width={40} height={40} />
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>Cas(キャス)</Typography>
      </Box>

      <Swiper spaceBetween={0} slidesPerView={1} style={{ width: '100%', height: '100%' }}>
        <SwiperSlide>
          <DeliRecruitIntro buttonAreaHeight={buttonAreaHeight} />
        </SwiperSlide>
        <SwiperSlide>
          <DeliRecruitDetail buttonAreaHeight={buttonAreaHeight} />
        </SwiperSlide>
        <SwiperSlide>
          <DeliRecruitExample buttonAreaHeight={buttonAreaHeight} />
        </SwiperSlide>
      </Swiper>

      {/* 固定ボタンエリア */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 0, width: '100%', px: 2, zIndex: 50 }}>
        {/* ボーナス文言 */}
        <Typography 
          sx={{ 
            textAlign: 'center', 
            color: '#FF3B3B', 
            fontWeight: 'bold', 
            mb: 1, 
            fontSize: '1rem'
          }}
        >
          今なら5,000円分のボーナスポイント進呈中！
        </Typography>

        {/* 登録ボタン */}
        <Button
          variant="contained"
          onClick={() => handleLogin('line')}
          disabled={loading}
          sx={{
            backgroundColor: '#FF80AB',
            color: 'white',
            borderRadius: '50px',
            padding: '14px 60px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '360px',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'none',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            '&:hover': { backgroundColor: '#FF4081' }
          }}
        >
          {loading ? 'ログイン中...' : '簡単配達スタッフ登録'}
          <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>

        {/* 補足情報 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
          <InfoIcon sx={{ color: '#FF80AB', fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '0.9rem', opacity: 0.8 }}>
            LINE認証が開きます
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// メインのページコンポーネント
export default function DeliRecruitPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>🔄 読み込み中...</p></div>}>
      <DeliRecruitPageContent />
    </Suspense>
  );
}