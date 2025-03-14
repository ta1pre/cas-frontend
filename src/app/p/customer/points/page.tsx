"use client";

import BalanceDisplay from "./components/BalanceDisplay"; // ✅ ポイント残高コンポーネント
import HistoryDisplay from "./components/HistoryDisplay"; // ✅ 履歴表示コンポーネント
import PurchasePoint from "./components/PurchasePoint"; // ✅ ポイント購入コンポーネント


export default function Page() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">💰 ポイント管理</h1>
            <BalanceDisplay /> {/* ✅ 残高表示 */}
            <HistoryDisplay /> {/* ✅ 履歴表示 */}
            <PurchasePoint /> {/* ✅ ポイント購入 */}
        </div>
    );
}
