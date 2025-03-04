// src/app/p/customer/castprof/[id]/components/profile/CastProfile.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { CastProfileResponse } from "../../api/castprofTypes";
import ProfileImages from "./ProfileImages";
import ProfileDetails from "./ProfileDetails"; // ✅ 追加

interface CastProfileProps {
    profile: CastProfileResponse;
}

export default function CastProfile({ profile }: CastProfileProps) {
    return (
        <Card className="w-full shadow-md border border-gray-200">
            {/* 画像エリア */}
            <ProfileImages images={profile.images || []} />

            {/* カードのコンテンツ（左寄せ） */}
            <CardContent className="p-4 text-left">
                {/* 名前 */}
                <Typography variant="h6" className="font-bold">{profile.name || "名前未設定"}</Typography>

                {/* 年齢 / 身長 / 職業 */}
                <Typography variant="body2" className="text-gray-700">
                    {profile.age ? `${profile.age}歳` : "年齢不明"} / {profile.height ? `${profile.height}cm` : "身長不明"}  
                    {profile.job && ` ${profile.job}`} 
                </Typography>

                {/* 自己紹介 */}
                {profile.self_introduction && (
                    <Typography variant="body2" className="text-gray-600 mt-3 border-t pt-2">
                        {profile.self_introduction}
                    </Typography>
                )}

                {/* ステータス（受付中 / 今すぐOK） */}
                {profile.available_at ? (
                    <Typography variant="body2" className="text-green-500 mt-2">🟢 今すぐOK</Typography>
                ) : (
                    <Typography variant="body2" className="text-gray-500 mt-2">受付中</Typography>
                )}
            </CardContent>

            {/* ✅ 詳細情報セクション */}
            <ProfileDetails />
        </Card>
    );
}
