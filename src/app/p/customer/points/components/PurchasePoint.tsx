"use client";

import { useState } from "react";
import purchasePoint from "../api/purchasePoint";

export default function PurchasePoint() {
    const [amount, setAmount] = useState<string>("100");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 数値をカンマ区切りにする関数
    const formatNumber = (num: number) => num.toLocaleString();

    // 入力値の変更処理
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handlePurchase = async () => {
        const numericAmount = Number(amount);

        if (numericAmount < 100 || numericAmount > 1000000 || isNaN(numericAmount)) {
            setMessage("⚠️ 購入可能なポイントは100～1,000,000です");
            return;
        }

        setLoading(true);
        setMessage("⏳ 購入処理中...");

        const response = await purchasePoint(numericAmount);
        if (response) {
            setMessage(`✅ ${formatNumber(numericAmount)}ポイントを購入しました！`);
        } else {
            setMessage("🚨 購入に失敗しました");
        }

        setLoading(false);
    };

    return (
        <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-300">
            <h2 className="text-lg font-bold text-gray-800 mb-2">ポイント購入</h2>
            <input
                type="text"
                value={amount}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full mb-3 text-lg shadow-sm"
            />
            <button
                className="w-full bg-green-500 text-white font-semibold px-4 py-3 rounded-md shadow-md hover:bg-green-600 disabled:opacity-50"
                onClick={handlePurchase}
                disabled={loading}
            >
                {loading ? "⏳ 購入処理中..." : `💰 ${formatNumber(Number(amount))} ポイント購入`}
            </button>
            {message && (
                <p
                    className={`mt-3 text-sm font-medium ${
                        message.startsWith("✅") ? "text-green-700" : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
