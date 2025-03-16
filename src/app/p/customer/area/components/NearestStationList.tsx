"use client";

import { useState } from "react";
import fetchNearestStations from "../api/fetchNearestStations";
import registerNearestStation from "../api/registerNearestStation";
import { Button, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import TrainIcon from "@mui/icons-material/Train";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Props {
  onStationRegister: () => void;
}

export default function NearestStationList({ onStationRegister }: Props) {
  const [stations, setStations] = useState<{ id: number; name: string; lineName: string; distanceKm: number }[]>([]);
  const [registeredStation, setRegisteredStation] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false); // ✅ ローディング状態追加

  const handleFindNearest = async () => {
    if (!navigator.geolocation) {
      console.error("🚨 位置情報が利用できません");
      return;
    }

    setLoading(true); // ✅ ローディング開始

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log(`📍 現在地: lat=${lat}, lon=${lon}`);

      setCurrentLocation({ lat, lon });

      const stationList = await fetchNearestStations(lat, lon);
      if (stationList) setStations(stationList);
      
      setLoading(false); // ✅ ローディング終了
    }, (error) => {
      console.error("🚨 位置情報の取得に失敗しました", error);
      setLoading(false); // ✅ エラー時もローディング終了
    });
  };

  const handleRegisterStation = async (stationId: number) => {
    await registerNearestStation(stationId);
    setRegisteredStation(stationId);
    onStationRegister();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">近くの駅を検索</h2>

      {/* ✅ ローディング中はボタンを非アクティブに */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleFindNearest} 
        className="w-full flex items-center justify-center"
        disabled={loading} // ✅ ローディング中は押せなくする
      >
        {loading ? (
          <CircularProgress size={24} className="mr-2 text-white" /> // ✅ スピナーを表示
        ) : (
          <GpsFixedIcon className="mr-2" />
        )}
        {loading ? "検索中..." : "GPSで近くの駅を取得する"}
        <ArrowDropDownIcon className="ml-2" />
      </Button>

      {stations.length > 0 && (
        <ul className="mt-4 space-y-2">
          {stations.map((station) => {
            const isSelected = registeredStation === station.id;
            return (
              <li
                key={station.id}
                onClick={() => handleRegisterStation(station.id)}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition duration-200 ${
                  isSelected
                    ? "bg-blue-400 text-white font-bold"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                <div>
                  <p className="text-base font-semibold">
                    {station.name}駅
                  </p>
                  <p className={`text-sm flex items-center ${isSelected ? "text-white font-semibold" : "text-gray-700 font-normal"}`}>
                    <TrainIcon className={`mr-1 ${isSelected ? "text-white" : "text-gray-700"}`} fontSize="small" />
                    {station.lineName ?? "不明"}
                  </p>
                </div>
                {isSelected && <CheckIcon className="text-white" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
