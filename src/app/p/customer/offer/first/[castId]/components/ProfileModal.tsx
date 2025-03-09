// src/app/p/customer/offer/components/ProfileModal.tsx
"use client";

import { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  castName: string;
  age?: number;
  profileImage?: string;
  reservationFee?: number;
  introduction?: string;
  castId: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, castName, age, profileImage, reservationFee, introduction, castId }) => {
  return (
    <Modal open={open} onClose={onClose} className="flex items-center justify-center">
      <Box className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        {/* キャスト画像 */}
        {profileImage && <img src={profileImage} alt={castName} className="w-32 h-32 mx-auto rounded-full mb-4" />}

        {/* キャスト情報 */}
        <Typography variant="h6" className="font-bold">{castName} {age ? `(${age}歳)` : ""}</Typography>
        <Typography variant="body2" className="text-gray-600 mt-2">指名料: {reservationFee ? `${reservationFee.toLocaleString()}pt` : "不明"}</Typography>
        <Typography variant="body2" className="text-gray-600 mt-2">{introduction || "紹介文なし"}</Typography>

        {/* 詳細ページへ */}
        <Button 
          variant="outlined" 
          fullWidth
          sx={{ marginTop: "12px" }}
          onClick={() => window.location.href = `/p/customer/castprof/${castId}`}
        >
          詳細を見る
        </Button>

        {/* 閉じるボタン */}
        <Button 
          variant="contained" 
          fullWidth
          sx={{ marginTop: "8px", backgroundColor: "#ec4899", "&:hover": { backgroundColor: "#db2777" } }}
          onClick={onClose}
        >
          閉じる
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
