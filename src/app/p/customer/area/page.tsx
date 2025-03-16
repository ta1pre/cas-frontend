"use client";

import { useState, useEffect } from "react";
import NearestStationSelection from "./components/NearestStationSelection"; // ✅ 新設したファイルを呼び出す
import CurrentStationCard from "./components/CurrentStationCard";
import fetchCurrentStation from "./api/fetchCurrentStation";
import { Divider } from "@mui/material";

interface Station {
  id: number;
  name: string;
  lineName: string;
}

export default function NearestStationPage() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [highlightTrigger, setHighlightTrigger] = useState(false);

  useEffect(() => {
    async function fetchStation() {
      const nearestStation = await fetchCurrentStation();
      setCurrentStation(nearestStation ? { ...nearestStation } : null);
    }
    fetchStation();
  }, []);

  // ✅ 駅が更新されたときの処理
  const refreshCurrentStation = async () => {
    const updatedStation = await fetchCurrentStation();
    if (updatedStation?.id !== currentStation?.id) {
      setHighlightTrigger((prev) => !prev); // ✅ ハイライト用のトリガーを切り替え
    }
    setCurrentStation(updatedStation ? { ...updatedStation } : null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-4">
      {/* ✅ ページタイトル */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">エリア設定</h3>

      {/* ✅ 現在の最寄り駅エリア */}
      <CurrentStationCard station={currentStation} highlightTrigger={highlightTrigger} />

      <Divider className="my-6" />

      {/* ✅ タブを表示し、ユーザーが駅を選択できる UI に */}
      <NearestStationSelection onStationRegister={refreshCurrentStation} />
    </div>
  );
}
