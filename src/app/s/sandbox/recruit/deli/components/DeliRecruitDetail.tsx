'use client';

import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import SwipeLeftRoundedIcon from '@mui/icons-material/SwipeLeftRounded';
import DeliRecruitSlide from './DeliRecruitSlide';

export default function DeliRecruitDetail({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  return (
    <DeliRecruitSlide
      bgGradient="linear-gradient(135deg, #FFF8DC 0%, #FFE4EC 100%)"
      title="自由なスケジュールで配達。"
      buttonAreaHeight={buttonAreaHeight}
    >
      <Typography sx={{ fontSize: '1.1rem', opacity: 0.8, mb: 2, textAlign: 'left' }}>
        飲食店や小売店から顧客へ商品をお届けする簡単なお仕事です。
        バイクや自転車での配達なので、交通渋滞を気にせず効率よく移動できます。
        配達経験がなくても安心のサポート体制あり。
        空いた時間を使って、フレキシブルに働けます。
        シフトの縛りがなく、アプリで簡単に配達依頼を受注できるシステムです。<br />
        プライベートも大切にしながら、自分のペースでOK！
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