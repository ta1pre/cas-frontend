"use client";

import BalanceDisplay from "./components/BalanceDisplay"; // ✅ ポイント残高コンポーネント
import HistoryDisplay from "./components/HistoryDisplay"; // ✅ 履歴表示コンポーネント
import Link from "next/link"; // ポイント購入ページへのリンク用
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
                <p className="text-gray-600">以下より購入ページへ移動して下さい。</p>
                <Link href="/p/customer/payment/points">
                  <button className="mt-4 w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-lg">
                    ポイント購入ページへ
                  </button>
                </Link>
            </div>
            
            <HistoryDisplay /> {/* ✅ 履歴表示 */}
        </div>
    );
}
