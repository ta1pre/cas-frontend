"use client";

import BalanceDisplay from "./components/BalanceDisplay"; // ✅ ポイント残高コンポーネント
import HistoryDisplay from "./components/HistoryDisplay"; // ✅ 履歴表示コンポーネント
// ✅ 一時的にポイント購入コンポーネントを削除
// import PurchasePoint from "./components/PurchasePoint";


export default function Page() {
    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ポイント管理</h1>
            <BalanceDisplay /> {/* ✅ 残高表示 */}
            
            {/* ✅ 一時的にポイント購入コンポーネントをプレースホルダーに置き換え */}
            <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-300">
                <h2 className="text-lg font-bold text-gray-800 mb-2">ポイント購入</h2>
                <p className="text-gray-600">Stripe決済を導入予定です。しばらくお待ちください。</p>
            </div>
            
            <HistoryDisplay /> {/* ✅ 履歴表示 */}
        </div>
    );
}
