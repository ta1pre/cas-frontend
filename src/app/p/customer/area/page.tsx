// 📂 src/app/p/customer/area/page.tsx
"use client";

import { useState, useEffect } from "react";
import NearestStationList from "./components/NearestStationList";
import StationSuggestSelector from "./components/StationSuggestSelector";
import CurrentStationCard from "./components/CurrentStationCard";
import fetchCurrentStation from "./api/fetchCurrentStation";
import { Typography, Divider, Card, CardContent } from "@mui/material";

interface Station {
    id: number;
    name: string;
    lineName: string;
}

export default function NearestStationPage() {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [currentStation, setCurrentStation] = useState<Station | null>(null);

    useEffect(() => {
        async function fetchStation() {
            const nearestStation = await fetchCurrentStation();
            setCurrentStation(nearestStation || null);
        }
        fetchStation();
    }, []);

    // ✅ 最寄り駅が変更されたら最新のデータを取得
    const refreshCurrentStation = async () => {
        const updatedStation = await fetchCurrentStation();
        setCurrentStation(updatedStation || null);
    };

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h4" className="font-bold mb-4">🚉 最寄り駅を設定</Typography>
            
            <Card className="shadow-md mb-6">
                <CardContent>
                    <CurrentStationCard station={currentStation} />
                </CardContent>
            </Card>
            
            <Card className="shadow-md mb-6">
                <CardContent>
                    <Typography variant="h6" className="font-semibold mb-2">🚉 近くの駅を検索</Typography>
                    <NearestStationList onStationRegister={refreshCurrentStation} />
                </CardContent>
            </Card>
            
            <Card className="shadow-md mb-6">
                <CardContent>
                    <Typography variant="h6" className="font-semibold mb-2">🔍 駅を検索して追加</Typography>
                    <StationSuggestSelector 
                        onStationSelect={(station) => {
                            setSelectedStation(station);
                            refreshCurrentStation(); // ✅ 駅が登録されたら最寄り駅を更新
                        }} 
                        defaultStation={currentStation ?? undefined}
                    />
                    {selectedStation && (
                        <div className="mt-4 p-3 border rounded bg-gray-100">
                            <Typography variant="body1" className="font-medium">✅ 選択された駅</Typography>
                            <Typography variant="body2" className="text-gray-700">
                                {selectedStation.name}（{selectedStation.lineName || '路線名不明'}）
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
