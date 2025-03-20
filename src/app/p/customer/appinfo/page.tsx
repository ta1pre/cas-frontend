// src/app/p/customer/appinfo/page.tsx
"use client";

import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoIcon from "@mui/icons-material/Info";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Button, Card, CardContent, Typography, Snackbar, IconButton } from "@mui/material";

export default function AppInfoPage() {
  const referralLink = "https://cas.id/?td=XV1r";
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-2 text-gray-800">
        <InfoIcon fontSize="large" className="text-blue-600" />
        <Typography variant="h5" fontWeight="bold">
          アプリインフォ
        </Typography>
      </div>

      {/* 紹介コード */}
      <Card className="shadow-lg">
        <CardContent className="flex flex-col space-y-4">
          <Typography variant="h6" className="flex items-center space-x-2">
            <CampaignIcon className="text-green-500" />
            <span>あなたの紹介コード</span>
          </Typography>
          <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <Typography variant="body1" className="font-mono">
              {referralLink}
            </Typography>
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon className="text-gray-500 hover:text-gray-700" />
            </IconButton>
          </div>
          <Typography variant="body2" className="text-gray-500">
            友達にこのリンクを共有すると特典がもらえます！
          </Typography>
        </CardContent>
      </Card>

      {/* キャンペーン情報（仮） */}
      <Card className="shadow-md">
        <CardContent className="space-y-2">
          <Typography variant="h6" className="flex items-center space-x-2">
            <CampaignIcon className="text-red-500" />
            <span>キャンペーン情報</span>
          </Typography>
          <Typography variant="body2" className="text-gray-700">
            ・春の新規登録キャンペーン！3月末までに登録するとポイント2倍  
            ・お友達紹介で500円分のポイントプレゼント！
          </Typography>
        </CardContent>
      </Card>

      {/* コピー成功通知 */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="紹介コードをコピーしました！"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
