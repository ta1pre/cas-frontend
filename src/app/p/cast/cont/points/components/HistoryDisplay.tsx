"use client";

import { useEffect, useState } from "react";
import fetchPointHistory from "../api/getHistory";

// `HistoryDisplay` コンポーネント
export default function HistoryDisplay() {
    const [history, setHistory] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [limit] = useState(5); // 1ページあたりの取得件数
    const [offset, setOffset] = useState(0); // 現在のオフセット

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

    function formatTransactionType(transaction: any) {
        const typeMap: { [key: string]: { label: string; color: string } } = {
            referral_bonus_pending: { label: "紹介ポイント（仮付与）", color: "text-yellow-600" },
            referral_bonus_completed: { label: "紹介ポイント（確定）", color: "text-green-600" },
            first_attendance_bonus: { label: "初回出勤ボーナス", color: "text-blue-600" },
            regular_attendance: { label: "通常出勤", color: "text-gray-600" },
            point_used: { label: "ポイント使用", color: "text-red-600" },
        };

        const typeInfo = typeMap[transaction.transaction_type] || { 
            label: transaction.rule_description || "その他", 
            color: "text-gray-600" 
        };

        return typeInfo;
    }

    function formatNumber(value: number) {
        return value.toLocaleString(); // カンマ区切り
    }

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">ポイント履歴</h2>
            {history.length > 0 ? (
                <ul className="mt-2 space-y-2">
                    {history.map((entry, index) => {
                        const typeInfo = formatTransactionType(entry);
                        return (
                            <li key={index} className="border-b py-2 flex justify-between items-center">
                                <div>
                                    <span className="text-gray-600">{formatDate(entry.created_at)}</span>
                                    <p className={`text-sm ${typeInfo.color}`}>{typeInfo.label}</p>
                                    {entry.transaction_type === "referral_bonus_pending" && (
                                        <p className="text-xs text-gray-500">※初回出勤で確定</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <strong className={entry.point_change >= 0 ? "text-green-600" : "text-red-600"}>
                                        {entry.point_change >= 0 ? `+${formatNumber(entry.point_change)}` : `${formatNumber(entry.point_change)}`}pt
                                    </strong>
                                    <p className="text-xs text-gray-500">({formatPointSource(entry.point_source)})</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="mt-2 text-gray-500">履歴がありません。</p>
            )}
        </div>
    );
}
