"use client";

import { useEffect, useState } from "react";
import fetchPointBalance from "../api/getBalance"; // ✅ API をインポート

// ✅ `BalanceDisplay` コンポーネント
export default function BalanceDisplay() {
    // ✅ ポイント残高を保存する `useState`
    const [points, setPoints] = useState<{ regular_points: number; bonus_points: number; total_points: number } | null>(null);

    // ✅ 初回レンダリング時に API からポイント情報を取得
    useEffect(() => {
        async function fetchData() {
            const data = await fetchPointBalance();
            if (data) {
                setPoints(data); // ✅ データを `useState` に保存
            }
        }
        fetchData();
    }, []);

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">💳 あなたのポイント残高</h2>
            {points ? (
                <div className="mt-2">
                    <p>🟢 通常ポイント: <strong>{points.regular_points}</strong></p>
                    <p>🔵 ボーナスポイント: <strong>{points.bonus_points}</strong></p>
                    <p>💰 合計ポイント: <strong className="text-lg text-green-600">{points.total_points}</strong></p>
                </div>
            ) : (
                <p className="mt-2 text-gray-500">ポイント情報を取得中...</p>
            )}
        </div>
    );
}
