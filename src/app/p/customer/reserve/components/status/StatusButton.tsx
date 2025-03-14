import { useState } from "react";
import useUser from "@/hooks/useUser";
import fetchChangeStatus from "./api/fetchChangeStatus"; // ✅ 追加

interface StatusButtonProps {
    reservationId: number;
    label: string;
    nextStatus: string;
    color: string;
    onPointShortage: (neededPoints: number) => void;
    onStatusChange?: () => void; // ✅ ステータス変更後の更新処理（オプション）
}

export default function StatusButton({ reservationId, label, nextStatus, color, onPointShortage, onStatusChange }: StatusButtonProps) {
    const [message, setMessage] = useState<string | null>(null);
    const user = useUser();

    const handleClick = async () => {
        if (!user) {
            setMessage("🚨 ユーザー情報が取得できません");
            return;
        }

        try {
            // ✅ 統一した関数を呼び出す
            const response = await fetchChangeStatus(nextStatus, reservationId, user.user_id);

            // ✅ ポイント不足時は通知
            if (response.status === "INSUFFICIENT_POINTS") {
                onPointShortage(response.shortfall);
                return;
            }

            // それ以外は正常
            setMessage(`✅ ${response.message}`);

            // ✅ ステータス変更成功後、一覧を更新（`onStatusChange` があれば実行）
            if (onStatusChange) {
                onStatusChange();
            }

        } catch (error) {
            setMessage("🚨 エラーが発生しました");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleClick}
                style={{ backgroundColor: color }}
                className="px-4 py-2 rounded text-white hover:opacity-80 transition-opacity duration-200"
            >
                {label}
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
}
