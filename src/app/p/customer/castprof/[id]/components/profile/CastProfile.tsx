// src/app/p/customer/castprof/[id]/components/profile/CastProfile.tsx

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { CastProfileResponse } from "../../api/castprofTypes";
import ProfileImages from "./ProfileImages";
import OfferButton from "@/app/p/customer/offer/components/button/OfferButton";
import ProfileContent from "./ProfileContent";
import MiniLog from "./MiniLog";

interface CastProfileProps {
  profile: CastProfileResponse;
}

// ✅ カンマ付きの金額フォーマット
const formatCurrency = (amount: number | null) => {
  return amount ? `${amount.toLocaleString("ja-JP")}pt` : "不明";
};

// ✅ CastProfile メインコンポーネント
export default function CastProfile({ profile }: CastProfileProps) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      {/* 画像エリア */}
      <Box className="relative w-full h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        <ProfileImages images={profile.images || []} fullWidth={true} />
        <Box className="absolute top-4 right-4 text-white text-3xl cursor-pointer z-10">★</Box>
      </Box>

      {/* コンバージョンエリア（カード型） */}
      {profile.available_at && (
        <Box className="w-11/12 max-w-md mx-auto bg-gray-200 rounded-2xl shadow-md p-4 flex flex-col items-center text-center mt-10">
          <Typography variant="h6" className="text-pink-600 font-bold">
            {new Date(profile.available_at).getHours()}時{new Date(profile.available_at).getMinutes()}分から待機中！
          </Typography>
          <OfferButton castId={profile.cast_id} type="first" />
          <Typography variant="body2" className="text-pink-600 font-bold" style={{ marginTop: "24px" }}>
            予約確定までポイント消費はありません
          </Typography>
        </Box>
      )}

      {/* プロフィール情報（途中まで） */}
      <Box className="w-full bg-white relative z-10 p-4 shadow-md max-w-screen-md mx-auto">
        {profile.self_introduction && (
          <Typography variant="body2" className="text-gray-600 text-lg font-semibold">
            {profile.self_introduction}
          </Typography>
        )}
        <Typography variant="h6" className="font-bold mt-2">
          {profile.name || "名前未設定"}
          {profile.age ? ` (${profile.age}歳)` : ""}
        </Typography>
        <Typography variant="body2" className="text-gray-700">
          {profile.height ? `T ${profile.height}` : ""}
          {profile.bust ? ` B ${profile.bust}${profile.cup ? `(${profile.cup})` : ""}` : ""}
          {profile.waist ? ` W ${profile.waist}` : ""}
          {profile.hip ? ` H ${profile.hip}` : ""}
          {profile.job ? ` ${profile.job}` : ""}
        </Typography>

        {/* ✅ 下線を復活 */}
        <Box className="border-t border-gray-300 my-3" />

        {/* ここから下をタブ切り替えに変更 */}
        {/* タブ切り替え */}
        <Box>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            sx={{
              borderBottom: "2px solid #f8b4d9", // ✅ 薄いピンクの下線
              "& .MuiTabs-indicator": {
                backgroundColor: "#f472b6", // ✅ 濃いめのピンク
              },
              "& .MuiTab-root": {
                flexGrow: 1, // ✅ タブを均等に広げる
                textAlign: "center",
                fontWeight: "bold",
                color: "#d9467e", // ✅ ピンク系のテキストカラー
              },
              "& .Mui-selected": {
                color: "#f472b6", // ✅ 選択中のタブカラー
              },
            }}
          >
            <Tab label="プロフィール" />
            <Tab label="ミニログ" />
          </Tabs>
        </Box>

        {/* タブコンテンツ */}
        <Box className="mt-4">
          {tabIndex === 0 && <ProfileContent profile={profile} />}
          {tabIndex === 1 && <MiniLog />}
        </Box>
      </Box>
    </>
  );
}
