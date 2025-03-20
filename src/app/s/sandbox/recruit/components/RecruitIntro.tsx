// 📂 app/recruit/components/RecruitIntro.tsx
'use client';

import { Typography, Box } from '@mui/material';
import SwipeLeftRoundedIcon from '@mui/icons-material/SwipeLeftRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { motion } from 'framer-motion';
import RecruitSlide from './RecruitSlide';

export default function RecruitIntro({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  return (
    <RecruitSlide
      bgGradient="linear-gradient(135deg, #FFE4EC 0%, #FFF8DC 100%)"
      title=""
      buttonAreaHeight={buttonAreaHeight}
    >
      {/* ✅ 全体をまとめて余白・バランス調整 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', lineHeight: 1.6 }}>
          好きな時間、
          好きな場所で<br />
          <Box component="span" sx={{ color: '#FF80AB', fontWeight: 'bold' }}>スキマをつかって
            <Box component="span" sx={{ color: '#FF3B3B', fontWeight: 'bold', fontSize: '1.8rem' }}>高収入</Box>
          </Box>
        </Typography>

        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, boxShadow: 2, textAlign: 'left', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>オンライン登録制</Typography>
          </Box>          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>高収入・時給5,000円以上可</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>シフト無し</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>ノルマ無し</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>面接無し</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
            <Typography sx={{ fontSize: '0.95rem', color: '#555' }}>スマホで簡単登録</Typography>
          </Box>
        </Box>

        {/* スワイプアイコンを左右にアニメーション */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '10px' }}
        >
          <SwipeLeftRoundedIcon sx={{ fontSize: '1.2rem', color: '#FF80AB' }} />
        </motion.div>
      </Box>
    </RecruitSlide>
  );
}
