// 📂 app/recruit/components/RecruitDetail.tsx
'use client';

import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import SwipeLeftRoundedIcon from '@mui/icons-material/SwipeLeftRounded';
import RecruitSlide from './RecruitSlide';

export default function RecruitDetail({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  return (
    <RecruitSlide
      bgGradient="linear-gradient(135deg, #FFF8DC 0%, #FFE4EC 100%)"
      title="いつもの私で、自分らしく。"
      buttonAreaHeight={buttonAreaHeight}
    >
      <Typography sx={{ fontSize: '1.1rem', opacity: 0.8, mb: 2, textAlign: 'left' }}>
        ギャラ飲み・レンタル彼女・お食事同行・買い物同行・イベントアテンドなど…
        おしゃれなレストランやカフェで、楽しい時間を一緒に過ごすお仕事です。
        🌿もちろん、身体の接触や性的なサービスは一切ありません🌿
        簡単な会話やお食事など、あなたらしく楽しく働けます。<br />
        プライベートも大切にしながら、自分のペースでOK！
      </Typography>

      {/* ✅ スワイプアイコン追加（横スライドアニメーション） */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '10px' }}
      >
        <SwipeLeftRoundedIcon sx={{ fontSize: '2rem', color: '#FF80AB' }} />
      </motion.div>
    </RecruitSlide>
  );
}
