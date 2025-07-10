"use client";

import BalanceDisplay from "./components/BalanceDisplay"; // ポイント残高コンポーネント
import HistoryDisplay from "./components/HistoryDisplay"; // 履歴表示コンポーネント
import ReferredUsersList from "./components/ReferredUsersList"; // 紹介したユーザー一覧
import ReferralLink from "./components/ReferralLink"; // 紹介リンク

export default function Page() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ポイント管理</h1>
            <BalanceDisplay /> {/* 残高表示 */}
            <ReferralLink /> {/* 紹介リンク */}
            <ReferredUsersList /> {/* 紹介したユーザー一覧 */}
            <HistoryDisplay /> {/* 履歴表示 */}
        </div>
    );
}
