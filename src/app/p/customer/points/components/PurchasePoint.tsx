// src/app/p/customer/points/components/PurchasePoint.tsx

"use client";

import { useState } from "react";
import purchasePoint from "../api/purchasePoint";

export default function PurchasePoint() {
    const [amount, setAmount] = useState<number>(100);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePurchase = async () => {
        if (amount < 100 || amount > 1000000) {
            setMessage("⚠️ 購入可能なポイントは100～1,000,000です");
            return;
        }

        setLoading(true);
        setMessage("購入処理中...");

        const response = await purchasePoint(amount);
        if (response) {
            setMessage(`✅ ${amount}ポイントを購入しました！`);
        } else {
            setMessage("🚨 購入に失敗しました");
        }

        setLoading(false);
    };

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-bold">ポイント購入</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                max={1000000}
                className="border rounded p-2 w-full mb-2"
            />
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                onClick={handlePurchase}
                disabled={loading}
            >
                {loading ? "処理中..." : `💰 ${amount}ポイント購入`}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
}
