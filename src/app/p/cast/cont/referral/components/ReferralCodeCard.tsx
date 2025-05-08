// src/components/ReferralCodeCard.tsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  invitationId: string;
}

const ReferralCodeCard: React.FC<Props> = ({ invitationId }) => {
  const shareUrl = `https://lp.cas.tokyo/cast/lux/first?tr=${invitationId}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
  const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('一緒に使おう！')}`;

  const handleCopy = () => {
    if (invitationId) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <Card className="max-w-md mx-auto my-8 bg-pink-50 border border-pink-200 shadow-md">
      <CardContent className="flex flex-col items-center">
        <Typography variant="h6" className="text-pink-500 font-bold mb-2">
          あなたの紹介URL
        </Typography>
        <div className="flex items-center space-x-2">
          <Typography variant="body2" className="text-gray-700 break-all">
            {shareUrl || '---'}
          </Typography>
          <Tooltip title="URLをコピー">
            <IconButton size="small" onClick={handleCopy} disabled={!invitationId}>
              <ContentCopyIcon fontSize="small" className="text-pink-400" />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant="body2" className="mt-2 text-gray-500">
          このURLからお友達が登録すると紹介特典がもらえます！
        </Typography>

        {/* シェアボタン（ロゴ画像リンク使用） */}
        <div className="mt-4 flex space-x-4">
          {/* LINE */}
          <a href={lineUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 transition text-white">
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/line.svg"
                alt="LINE"
                className="w-5 h-5 mr-2 invert"
              />
              <span className="text-sm font-semibold">LINEでシェア</span>
            </div>
          </a>

          {/* X */}
          <a href={xUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center px-4 py-2 rounded-full bg-black hover:bg-gray-800 transition text-white">
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg"
                alt="X"
                className="w-5 h-5 mr-2 invert"
              />
              <span className="text-sm font-semibold">Xでシェア</span>
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeCard;
