// 📂 src/app/p/customer/area/components/NearestStationList.tsx
"use client";
import { useState } from "react";
import fetchNearestStations from "../api/fetchNearestStations";
import registerNearestStation from "../api/registerNearestStation";

interface Props {
    onStationRegister: () => void; // ✅ 最寄り駅の更新用関数
}

export default function NearestStationList({ onStationRegister }: Props) {
    const [stations, setStations] = useState<{ id: number; name: string; lineName: string; distanceKm: number }[]>([]);
    const [selectedStation, setSelectedStation] = useState<number | null>(null);
    const [registeredStation, setRegisteredStation] = useState<number | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

    const handleFindNearest = async () => {
        if (!navigator.geolocation) {
            console.error("🚨 位置情報が利用できません");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`📍 現在地: lat=${lat}, lon=${lon}`);

            setCurrentLocation({ lat, lon }); 
            
            const stationList = await fetchNearestStations(lat, lon);
            if (stationList) setStations(stationList);
        }, (error) => {
            console.error("🚨 位置情報の取得に失敗しました", error);
        });
    };

    const handleRegisterStation = async () => {
        if (!selectedStation) return;
        await registerNearestStation(selectedStation);
        setRegisteredStation(selectedStation);
        onStationRegister(); // ✅ 最寄り駅を更新
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">🚉 近くの駅を検索</h2>
            <button onClick={handleFindNearest} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                近くの駅を探す
            </button>

            {currentLocation && (
                <p className="mt-2 text-sm text-gray-600">
                    📍 現在地: 緯度 {currentLocation.lat}, 経度 {currentLocation.lon}
                </p>
            )}

            {stations.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {stations.map((station) => (
                        <li
                            key={station.id}
                            onClick={() => setSelectedStation(station.id)}
                            className={`p-2 border rounded cursor-pointer ${
                                registeredStation === station.id
                                    ? "bg-green-300 font-bold"
                                    : selectedStation === station.id
                                    ? "bg-gray-300"
                                    : "bg-gray-100"
                            }`}
                        >
                            <p className="text-lg font-medium">{station.name}（{station.distanceKm ?? "N/A"} km）</p>
                            <p className="text-sm text-gray-600">🚆 {station.lineName ?? "不明"}</p>
                        </li>
                    ))}
                </ul>
            )}

            {selectedStation && (
                <button onClick={handleRegisterStation} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
                    この駅を最寄り駅にする
                </button>
            )}
        </div>
    );
}
