'use client';

import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import SwipeLeftRoundedIcon from '@mui/icons-material/SwipeLeftRounded';
import DeliRecruitSlide from './DeliRecruitSlide';

export default function DeliRecruitDetail({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  return (
    <DeliRecruitSlide
      bgGradient="linear-gradient(135deg, #FFF8DC 0%, #FFE4EC 100%)"
      title="自由に稼ごう！"
      buttonAreaHeight={buttonAreaHeight}
    >
      <Typography sx={{ fontSize: '1.1rem', opacity: 0.8, mb: 2, textAlign: 'left' }}>
        初めての風俗バイト。ノルマも無しなのにとっても高収入が可能。
        空いた時間を使って、効率よく働けます。
        空間も大切にしながら、自分のペースでOK！
      </Typography>

      {/* スワイプアイコン追加（横スライドアニメーション） */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '10px' }}
      >
        <SwipeLeftRoundedIcon sx={{ fontSize: '2rem', color: '#FF80AB' }} />
      </motion.div>
    </DeliRecruitSlide>
  );
} 