// 📂 app/recruit/components/RecruitExample.tsx
'use client';

import { Typography, Box, Button, Modal, IconButton } from '@mui/material';
import { useState } from 'react';
import RecruitSlide from './RecruitSlide';
import FemaleIcon from '@mui/icons-material/Female';
import CloseIcon from '@mui/icons-material/Close';

export default function RecruitExample({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  return (
    <RecruitSlide
      bgGradient="linear-gradient(135deg, #FFF8DC 0%, #FFE4EC 100%)"
      title="リアルな収入例"
      buttonAreaHeight={buttonAreaHeight}
    >
      <Box sx={{ textAlign: 'left', fontSize: '1rem', opacity: 0.9 }}>

        {/* Aさん 学生例 */}
        <Box sx={{ mb: 4, p: 2, background: '#fff', borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FemaleIcon sx={{ color: '#FF80AB' }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', lineHeight: 1.2 }}>スキマでサクッと稼ぐ Aさん</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#888' }}>学生</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>日当目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>12,000円</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>月収目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>約96,000円</Typography>
              </Box>
            </Box>
            <Button variant="outlined" color="secondary" onClick={() => setOpenA(true)} sx={{ fontSize: '0.9rem' }}>
              時間割
            </Button>
          </Box>
        </Box>

        {/* Bさん フリーター例 */}
        <Box sx={{ mb: 2, p: 2, background: '#fff', borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FemaleIcon sx={{ color: '#FF80AB' }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', lineHeight: 1.2 }}>1日しっかり稼ぐ Bさん</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#888' }}>フリーター</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>週4~5程度でフルタイム</Typography>              
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>日当目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>36,000円</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>月収目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>約576,000円</Typography>
              </Box>
            </Box>
            <Button variant="outlined" color="secondary" onClick={() => setOpenB(true)} sx={{ fontSize: '0.9rem' }}>
              時間割
            </Button>
          </Box>
        </Box>

        {/* モーダル A */}
        <Modal open={openA} onClose={() => setOpenA(false)}>
          <Box sx={{ p: 4, background: '#fff', borderRadius: 2, maxWidth: 380, mx: 'auto', my: '10%', boxShadow: 5, position: 'relative' }}>
            <IconButton onClick={() => setOpenA(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Aさんの1日（学生）</Typography>
            <Typography>🕒 18:50 講義終了</Typography>
            <Typography>🕒 19:00 アプリでマッチング</Typography>
            <Typography>🕒 20:00 待ち合わせ・食事（レストラン）</Typography>
            <Typography>🕒 22:00 解散</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#FF3B3B' }}>手取り：12,000円</Typography>
            <Typography sx={{ mt: 2 }}>
              🎀 ちょっと空いた時間に美味しいご飯♪<br />
              🎀 楽しく過ごすだけでしっかり収入！
            </Typography>
          </Box>
        </Modal>

        {/* モーダル B */}
        <Modal open={openB} onClose={() => setOpenB(false)}>
          <Box sx={{ p: 4, background: '#fff', borderRadius: 2, maxWidth: 400, mx: 'auto', my: '5%', boxShadow: 5, position: 'relative' }}>
            <IconButton onClick={() => setOpenB(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Bさんの1日（フリーター）</Typography>
            <Typography>🕒 10:00 アプリチェック</Typography>
            <Typography>🕒 11:00 ランチデート（イタリアン）</Typography>
            <Typography>🕒 14:00 カフェ・お散歩</Typography>
            <Typography>🕒 19:00 焼肉屋で食事同行</Typography>
            <Typography>🕒 22:00 バーで楽しく過ごす</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#FF3B3B' }}>手取り：36,000円</Typography>
            <Typography sx={{ mt: 2 }}>
              🎀 1日でガッツリ！いろんな人と楽しい時間<br />
              🎀 好きなタイミングで自由に働ける！
            </Typography>
          </Box>
        </Modal>
      </Box>
    </RecruitSlide>
  );
}
