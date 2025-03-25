'use client';

import { Typography, Box, Button, Modal, IconButton } from '@mui/material';
import { useState } from 'react';
import DeliRecruitSlide from './DeliRecruitSlide';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CloseIcon from '@mui/icons-material/Close';

export default function DeliRecruitExample({ buttonAreaHeight }: { buttonAreaHeight: number }) {
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  return (
    <DeliRecruitSlide
      bgGradient="linear-gradient(135deg, #FFF8DC 0%, #FFE4EC 100%)"
      title="リアルな収入例"
      buttonAreaHeight={buttonAreaHeight}
    >
      <Box sx={{ textAlign: 'left', fontSize: '1rem', opacity: 0.9 }}>

        {/* Aさん 学生例 */}
        <Box sx={{ mb: 4, p: 2, background: '#fff', borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DirectionsBikeIcon sx={{ color: '#FF80AB' }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', lineHeight: 1.2 }}>放課後に効率よく Aさん</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#888' }}>大学生・バイト</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>日当目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>6,000円</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>月収目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>約72,000円</Typography>
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
            <DirectionsBikeIcon sx={{ color: '#FF80AB' }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', lineHeight: 1.2 }}>専業で稼ぐ Bさん</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#888' }}>フリーター</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>週5日フルタイム</Typography>              
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#333' }}>日当目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', mb: 0.5, color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>12,000円</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>月収目安</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#FF3B3B', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>約264,000円</Typography>
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
            <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Aさんの1日（大学生）</Typography>
            <Typography>🕒 15:00 授業終了</Typography>
            <Typography>🕒 15:30 アプリで配達開始</Typography>
            <Typography>🕒 18:30 夕食タイムに集中配達</Typography>
            <Typography>🕒 20:00 配達終了</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#FF3B3B' }}>収入：6,000円</Typography>
            <Typography sx={{ mt: 2 }}>
              🚲 自転車を使った効率的な配達<br />
              🚲 夕方の需要が高い時間帯に集中
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
            <Typography>🕒 10:00 朝の配達スタート</Typography>
            <Typography>🕒 11:00 ランチタイム配達（繁忙期）</Typography>
            <Typography>🕒 14:00 小休憩</Typography>
            <Typography>🕒 17:00 夕方の配達再開</Typography>
            <Typography>🕒 21:00 配達終了</Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#FF3B3B' }}>収入：12,000円</Typography>
            <Typography sx={{ mt: 2 }}>
              🛵 バイクを使って広範囲をカバー<br />
              🛵 需要ピーク時に集中して効率アップ
            </Typography>
          </Box>
        </Modal>
      </Box>
    </DeliRecruitSlide>
  );
} 