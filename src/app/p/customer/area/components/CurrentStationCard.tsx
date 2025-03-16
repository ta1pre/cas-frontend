"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";

interface Station {
  id: number;
  name: string;
  lineName: string;
}

interface Props {
  station: Station | null;
  highlightTrigger: boolean; // ✅ ハイライト用フラグ
}

export default function CurrentStationCard({ station, highlightTrigger }: Props) {
  const [highlight, setHighlight] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!station) return;

    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    setHighlight(true);
    const timer = setTimeout(() => {
      setHighlight(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [highlightTrigger, station]);

  return (
    <Card
      style={{
        backgroundColor: highlight ? "#3B82F6" : "#1E40AF", // ✅ 濃淡変更のみ（青系統で統一）
        transition: "background-color 0.5s ease-in-out",
        color: "white",
      }}
      className="shadow-lg rounded-lg"
    >
      <CardContent>
        {/* ✅ ヘッダー部分（「現在のエリア」を小さめに） */}
        <Typography variant="body2" className="text-gray-300 mb-2">
          現在のエリア
        </Typography>

        {/* ✅ 駅名 + アイコン + 周辺 */}
        <Box className="flex flex-col items-center">
          {/* ✅ アイコン & 駅名 & 周辺 */}
          <Box className="flex items-baseline space-x-2">
            <RoomIcon className="text-red-500" fontSize="medium" />
            <Typography variant="h4" className="font-bold text-white">
              {station?.name}駅
            </Typography>
            <Typography variant="h6" className="text-white opacity-80">周辺</Typography>
          </Box>

          {/* ✅ 路線名をアイコンの下に配置 */}
          {station?.lineName && (
            <Box className="flex items-center mt-1">
              <Typography variant="body1" className="text-white opacity-80">
                {station.lineName}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
