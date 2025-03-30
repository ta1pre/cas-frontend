import { useState } from "react";
import useUser from "@/hooks/useUser";
import fetchChangeStatus from "./api/fetchChangeStatus"; // API呼び出し関数

interface StatusButtonProps {
    reservationId: number;
    label: string;
    nextStatus: string;
    color: string;
    onPointShortage: (neededPoints: number) => void;
    onStatusChange?: () => void; // ステータス変更後の更新処理（オプション）
}

export default function StatusButton({ reservationId, label, nextStatus, color, onPointShortage, onStatusChange }: StatusButtonProps) {
    // message state は alert を使うため不要に
    // const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();

    const handleClick = async () => {
        if (!user) {
            alert("ユーザー情報が取得できません"); // alertに変更
            return;
        }

        // --- ▼▼▼ 予約確定の場合のみ確認ダイアログを表示 ▼▼▼ ---
        if (nextStatus === 'confirmed') {
            const isConfirmed = window.confirm(
                "予約を確定しますか？\nポイントがデポジットとして使用されます。"
            );
            if (!isConfirmed) {
                return; // キャンセルされたら何もしない
            }
        }
        // --- ▲▲▲ 確認ダイアログここまで ▲▲▲ ---

        setIsLoading(true);
        
        try {
            // GPS情報を取得（到着ボタンの場合のみ）
            let latitude: number | undefined;
            let longitude: number | undefined;

            if (nextStatus === "user_arrived" && navigator.geolocation) {
                // setMessage("位置情報を取得中..."); // alertに変更するため不要に
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        });
                    });
                    
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    console.log("GPS情報取得成功:", { latitude, longitude });
                } catch (geoError: any) {
                    console.error("GPSエラー:", geoError.message);
                    alert(`位置情報の取得に失敗しました: ${geoError.message}`); // alertに変更
                    setIsLoading(false);
                    return; // 位置情報が取得できなければ処理を中止
                }
            }

            // 統一した関数を呼び出す
            const response = await fetchChangeStatus(nextStatus, reservationId, user.user_id, latitude, longitude);

            // --- ▼▼▼ APIレスポンスに応じた処理 (修正) ▼▼▼ ---
            // まずポイント不足を確認
            if (response.status === "INSUFFICIENT_POINTS") {
                onPointShortage(response.shortfall);
            } else {
                // ポイント不足でなく、API呼び出しでエラーがスローされなければ成功とみなす
                alert(response.message || "処理が完了しました。"); 
                if (onStatusChange) {
                    onStatusChange(); // UI更新
                }
            }
            // --- ▲▲▲ レスポンス処理ここまで ▲▲▲ ---

        } catch (error: any) {
            console.error("ステータス変更エラー:", error);
            alert(`エラーが発生しました: ${error.message || error}`); // エラー通知
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleClick}
                style={{ backgroundColor: color }}
                className="px-5 py-2.5 rounded-md text-white font-bold text-base hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 shadow-md"
                disabled={isLoading}
            >
                {isLoading ? "処理中..." : label}
            </button>
            {/* message state と関連する表示は削除 */}
            {/* {message && <p className="mt-2 text-sm text-gray-600">{message}</p>} */}
        </div>
    );
}
