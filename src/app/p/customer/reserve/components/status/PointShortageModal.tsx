"use client";
import { useState } from "react";
// ✅ 直接購入機能を削除
// import purchasePoint from "@/app/p/customer/points/api/purchasePoint";
// ✅ 統一された関数をインポート
import fetchChangeStatus from "./api/fetchChangeStatus"; 
// ↑ importパスは実際のフォルダ構造に合わせて修正して下さい

interface PointShortageModalProps {
    shortfall: number | null;
    reservationId: number;
    userId: number;
    onClose: () => void;
    onPurchase?: () => Promise<void>;
}

export default function PointShortageModal({
    shortfall,
    reservationId,
    userId,
    onClose,
    onPurchase
}: PointShortageModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (shortfall === null) return null;
    
    // ✅ 直接購入機能を一時的に削除（Stripe決済導入まで）
    const handlePurchase = async () => {
        setError("この機能は現在準備中です。Stripe決済を導入予定です。");
        // TODO: Stripe決済を導入する
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
                <h2 className="text-lg font-bold">⚠️ ポイント不足</h2>
                <p className="mt-2 text-gray-700">
                    あと <span className="font-bold">{shortfall} ポイント</span> 必要です。
                </p>
                <p className="mt-2 text-sm text-red-500">即時決済されます。</p>

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-4 flex justify-center gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        onClick={onClose}
                        disabled={loading}
                    >
                        キャンセル
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                        onClick={handlePurchase}
                        disabled={loading}
                    >
                        {loading ? "処理中..." : "不足分を購入"}
                    </button>
                </div>
            </div>
        </div>
    );
}
