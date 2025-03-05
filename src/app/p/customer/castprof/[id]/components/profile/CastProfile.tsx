// src/app/p/customer/castprof/[id]/components/CastProfile.tsx
import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { CastProfileResponse } from "../../api/castprofTypes";
import ProfileImages from "./ProfileImages";
import ProfileDetails from "./ProfileDetails"; // ✅ 追加
import { prefectureMap } from "@/app/p/customer/search/config/prefectures";
import EastIcon from '@mui/icons-material/East';

interface CastProfileProps {
    profile: CastProfileResponse;
}

// ✅ カンマ付きの金額フォーマット関数
const formatCurrency = (amount: number | null) => {
    return amount ? `${amount.toLocaleString("ja-JP")}pt` : "不明";
};

// ✅ 数値IDを都道府県名に変換する関数
const formatPrefecture = (code: string | null) => {
    const numCode = Number(code); // ✅ `string` → `number` に変換
    return numCode && prefectureMap[numCode] ? prefectureMap[numCode] : "不明";
};

// ✅ 時刻フォーマット関数
const formatTime = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getHours()}時${d.getMinutes()}分 更新`;
};

export default function CastProfile({ profile }: CastProfileProps) {
    return (
        <>
            {/* 画像エリア */}
            <Box className="relative w-full h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
                <ProfileImages images={profile.images || []} fullWidth={true} />

                {/* ✅ お気に入りボタン */}
                <Box className="absolute top-4 right-4 text-white text-3xl cursor-pointer z-10">
                    ★
                </Box>
            </Box>

{/* ✅ コンバージョンエリア（カード型） */}
{profile.available_at && (
    <Box className="w-11/12 max-w-md mx-auto bg-gray-200 rounded-2xl shadow-md p-4 flex flex-col items-center text-center mt-10">
        {/* ステータス */}
        <Typography variant="h6" className="text-pink-600 font-bold">
            {new Date(profile.available_at).getHours()}時{new Date(profile.available_at).getMinutes()}分から待機中！
        </Typography>
        {/* ボタン */}
        <Button
            variant="contained"
            fullWidth
            sx={{
                backgroundColor: "#ec4899",
                "&:hover": { backgroundColor: "#db2777" },
                borderRadius: "9999px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <span style={{ flex: 1, textAlign: "center" }}>今すぐ簡単リクエスト</span>
            <EastIcon />
        </Button>
        {/* 予約確定までポイント消費なし */}
        <Typography variant="body2" className="text-pink-600 font-bold" style={{ marginTop: "24px" }}>
            予約確定までポイント消費はありません
        </Typography>
    </Box>
)}



            {/* ✅ プロフィール情報 */}
            <Box className="w-full bg-white relative z-10 p-4 shadow-md max-w-screen-md mx-auto">
                {/* ✅ ひとことアピール */}
                {profile.self_introduction && (
                    <Typography variant="body2" className="text-gray-600 text-lg font-semibold">
                        {profile.self_introduction}
                    </Typography>
                )}

                {/* ✅ 名前(年齢) */}
                <Typography variant="h6" className="font-bold mt-2">
                    {profile.name || "名前未設定"}{profile.age ? ` (${profile.age}歳)` : ""}
                </Typography>

                {/* ✅ T 169 B 88(C) W 88 H 88 学生 */}
                <Typography variant="body2" className="text-gray-700">
                    {profile.height ? `T ${profile.height}` : ""}
                    {profile.bust ? ` B ${profile.bust}${profile.cup ? `(${profile.cup})` : ""}` : ""}
                    {profile.waist ? ` W ${profile.waist}` : ""}
                    {profile.hip ? ` H ${profile.hip}` : ""}
                    {profile.job ? ` ${profile.job}` : ""}
                </Typography>

                {/* ✅ 下線を復活 */}
                <Box className="border-t border-gray-300 my-3"></Box>

                {/* ✅ 追加情報を角丸タグで表示 */}
<Box className="flex flex-wrap gap-2 text-sm text-gray-700">
    {profile.support_area && (
        <Box className="px-3 py-1 bg-gray-100 rounded-full">
            {formatPrefecture(profile.support_area)}
        </Box>
    )}
        {profile.reservation_fee && (
        <Box className="px-3 py-1 bg-gray-100 rounded-full">
            指名料: {formatCurrency(profile.reservation_fee)}
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

                {/* ✅ 詳細情報セクション */}
                <ProfileDetails traits={profile.traits || []} serviceTypes={profile.service_types || []} />
            </Box>
        </>
    );
}
