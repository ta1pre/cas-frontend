//src/app/p/customer/points/components/HistoryDisplay.tsx

"use client";

import { useEffect, useState } from "react";
import fetchPointHistory from "../api/getHistory"; 

// ✅ `HistoryDisplay` コンポーネント
export default function HistoryDisplay() {
    const [history, setHistory] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [limit] = useState(5); // ✅ 1ページあたりの取得件数
    const [offset, setOffset] = useState(0); // ✅ 現在のオフセット

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPointHistory(limit, offset);
            if (data) {
                setHistory(data.history);
                setTotalCount(data.total_count);
            }
        }
        fetchData();
    }, [offset]);

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${month}/${day} ${hours}:${minutes}`;
    }

    function formatPointSource(source: string) {
        return source === "regular" ? "通常" : "ボーナス";
    }

    function formatNumber(value: number) {
        return value.toLocaleString(); // ✅ カンマ区切り
    }

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">📜 ポイント履歴</h2>
            {history.length > 0 ? (
                <ul className="mt-2 space-y-2">
                    {history.map((entry, index) => (
                        <li key={index} className="border-b py-2 flex justify-between items-center py-2">
                            <div>
                                <span className="text-gray-600">{formatDate(entry.created_at)}</span>{" "}
                                <span className="text-gray-500">({formatPointSource(entry.point_source)})</span>
                            </div>
                            <div className="text-right">
                                <strong className={entry.point_change >= 0 ? "text-green-600" : "text-red-600"}>
                                    {entry.point_change >= 0 ? `+${formatNumber(entry.point_change)}` : `${formatNumber(entry.point_change)}`}pt
                                </strong>
                                <p className="text-sm text-gray-500">{entry.rule_description || "不明な取引"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-gray-500">履歴がありません。</p>
            )}
        </div>
    );
}
