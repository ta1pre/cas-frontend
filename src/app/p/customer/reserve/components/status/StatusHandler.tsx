import { useState } from "react";
import StatusButton from "./StatusButton"; // ✅ 共通ボタンパーツ
import PointShortageModal from "./PointShortageModal"; // ✅ モーダルをインポート
import useUser from "@/hooks/useUser"; // ✅ ユーザー情報を取得
import fetchCustomerReserve from "../../api/resvlist"; // ✅ 予約一覧を取得する関数

interface StatusHandlerProps {
    reservationId: number;
    statusKey: string;
    onUpdate?: () => Promise<void>; // ✅ 親コンポーネントから更新処理を渡す
}

// ✅ ステータスごとの表示設定（仮）
const statusConfig: Record<string, { text: string; buttons?: { label: string; nextStatus: string; color: string }[] }> = {
    requested: { text: "🔄 キャスト確認中" },
    adjusting: { text: "⚙️ 予約調整中" },
    waiting_user_confirm: {
        text: "",
        buttons: [
            { label: "予約確定", nextStatus: "confirmed", color: "green" },
            { label: "修正依頼", nextStatus: "adjusting", color: "orange" },
        ],
    },
    confirmed: { text: "✅ 予約確定済み" },
};

export default function StatusHandler({ reservationId, statusKey, onUpdate }: StatusHandlerProps) {
    const config = statusConfig[statusKey] || { text: "❓ 未知のステータス" };

    const [shortfall, setShortfall] = useState<number | null>(null); // ✅ ポイント不足時に保存
    const user = useUser(); // ✅ ユーザー情報取得

    return (
        <div className="p-2 mt-4 bg-gray-100 rounded text-center">
            <p className="font-semibold">📌 予約ID: {reservationId}</p>
            <p className="text-lg font-medium">{config.text}</p>

            {config.buttons && (
                <div className="mt-2 flex justify-center gap-2">
                    {config.buttons.map((button) => (
<StatusButton
  key={button.nextStatus}
  reservationId={reservationId}
  label={button.label}
  nextStatus={button.nextStatus}
  color={button.color}
  onPointShortage={setShortfall}
  onStatusChange={() => {
    console.log("🟡 StatusHandler.tsx で onStatusChange が呼ばれた");
    onUpdate?.();
  }} // ✅ ここでデバッグログを追加
/>

                    ))}
                </div>
            )}

            {/* ✅ ポイント不足モーダル */}
            <PointShortageModal 
                shortfall={shortfall} 
                reservationId={reservationId} 
                userId={user?.user_id ?? 0} 
                onClose={() => setShortfall(null)}
                onPurchase={onUpdate} // ✅ 購入後に一覧を更新
            />
        </div>
    );
}
