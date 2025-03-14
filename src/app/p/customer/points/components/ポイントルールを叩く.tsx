"use client";

import { useState } from "react";
import applyPointRule from "../api/applyPoint"; // ✅ APIをインポート

// ✅ ボタンコンポーネント
export default function ApplyPointButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleApply = async () => {
        setLoading(true);
        setMessage("適用中...");

        const response = await applyPointRule("simple_test_rule"); // ✅ テストルール適用

        if (response) {
            setMessage("✅ ポイントが適用されました！");
        } else {
            setMessage("🚨 ポイント適用に失敗しました");
        }

        setLoading(false);
    };

    return (
        <div className="mt-4">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                onClick={handleApply}
                disabled={loading}
            >
                {loading ? "処理中..." : "🎉 1ポイント適用"}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
}
