"use client";

import { useEffect, useState } from "react";
import fetchPointBalance from "../api/getBalance"; // APIをインポート

// `BalanceDisplay`コンポーネント
export default function BalanceDisplay() {
    // ポイント残高を保持する`useState`
    const [points, setPoints] = useState<{ 
        regular_points: number; 
        bonus_points: number; 
        pending_points: number;
        total_points: number 
    } | null>(null);

    // マウント時APIからポイント情報を取得
    useEffect(() => {
        async function fetchData() {
            const data = await fetchPointBalance();
            if (data) {
                setPoints(data); // データを`useState`に保持
            }
        }
        fetchData();
    }, []);

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">ポイント残高</h2>
            {points ? (
                <div className="mt-2">
                    <p>通常ポイント: <strong>{points.regular_points.toLocaleString()}</strong></p>
                    <p>ボーナスポイント: <strong>{points.bonus_points.toLocaleString()}</strong></p>
                    {points.pending_points > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-yellow-800">
                                仮ポイント: <strong>{points.pending_points.toLocaleString()}</strong>
                            </p>
                            <p className="text-sm text-yellow-600 mt-1">
                                ※紹介された方が初回出勤を達成すると確定します
                            </p>
                        </div>
                    )}
                    <p className="mt-2">合計ポイント: <strong className="text-lg text-green-600">{points.total_points.toLocaleString()}</strong></p>
                </div>
            ) : (
                <p className="mt-2 text-gray-500">ポイント情報を取得中...</p>
            )}
        </div>
    );
}
