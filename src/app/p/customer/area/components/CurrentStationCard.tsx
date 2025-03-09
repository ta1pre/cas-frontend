// 📂 src/app/p/customer/area/components/CurrentStationCard.tsx
"use client";

import { Card, CardContent, Typography } from "@mui/material";

interface Station {
    id: number;
    name: string;
    lineName: string;
}

interface Props {
    station: Station | null; // ✅ Props に `station` を定義
}

export default function CurrentStationCard({ station }: Props) {
    return (
        <Card className="shadow-md">
            <CardContent>
                <Typography variant="h6" className="font-semibold">現在の最寄り駅</Typography>
                {station ? (
                    <Typography variant="body1" className="text-gray-700">
                        {station.name}（{station.lineName || "路線名不明"}）
                    </Typography>
                ) : (
                    <Typography variant="body1" className="text-gray-500">
                        🚉 最寄り駅が設定されていません。
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
