// src/app/p/customer/castprof/[id]/components/profile/ProfileContent.tsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { CastProfileResponse } from "../../api/castprofTypes";
import { prefectureMap } from "@/app/p/customer/search/config/prefectures";
import ProfileDetails from "./ProfileDetails";

// ✅ カンマ付きの金額フォーマット
const formatCurrency = (amount: number | null) => {
  return amount ? `${amount.toLocaleString("ja-JP")}pt` : "不明";
};

// ✅ 数値IDを都道府県名に変換
const formatPrefecture = (code: string | null) => {
  const numCode = Number(code);
  return numCode && prefectureMap[numCode] ? prefectureMap[numCode] : "不明";
};

interface ProfileContentProps {
  profile: CastProfileResponse;
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  return (
    <>
      {/* 追加情報を角丸タグで表示 */}
      <Box className="flex flex-wrap gap-2 text-sm text-gray-700">
        {profile.support_area && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">
            {formatPrefecture(profile.support_area)}
          </Box>
        )}
        {profile.popularity && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">人気度: {profile.popularity}</Box>
        )}
        {profile.rating && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">評価: {profile.rating.toFixed(1)}</Box>
        )}
        {profile.birthplace && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">{formatPrefecture(profile.birthplace)}出身</Box>
        )}
        {profile.blood_type && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">{profile.blood_type}型</Box>
        )}
        {profile.hobby && (
          <Box className="px-3 py-1 bg-gray-100 rounded-full">{profile.hobby}</Box>
        )}
      </Box>

      {/* 詳細情報セクション */}
      <ProfileDetails traits={profile.traits || []} serviceTypes={profile.service_types || []} />
    </>
  );
}
