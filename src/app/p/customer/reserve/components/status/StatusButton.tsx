import { useState } from "react";
import useUser from "@/hooks/useUser";
import fetchChangeStatus from "./api/fetchChangeStatus"; // 

interface StatusButtonProps {
    reservationId: number;
    label: string;
    nextStatus: string;
    color: string;
    onPointShortage: (neededPoints: number) => void;
    onStatusChange?: () => void; // ステータス変更後の更新処理（オプション）
}

export default function StatusButton({ reservationId, label, nextStatus, color, onPointShortage, onStatusChange }: StatusButtonProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();

    const handleClick = async () => {
        if (!user) {
            setMessage("ユーザー情報が取得できません");
            return;
        }

        setIsLoading(true);
        
        try {
            // GPS情報を取得（到着ボタンの場合のみ）
            let latitude: number | undefined;
            let longitude: number | undefined;

            if (nextStatus === "user_arrived" && navigator.geolocation) {
                setMessage("位置情報を取得中...");
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
                    setMessage(`位置情報の取得に失敗しました: ${geoError.message}`);
                    setIsLoading(false);
                    return; // 位置情報が取得できなければ処理を中止
                }
            }

            // 統一した関数を呼び出す
            const response = await fetchChangeStatus(nextStatus, reservationId, user.user_id, latitude, longitude);

            // ポイント不足時は通知
            if (response.status === "INSUFFICIENT_POINTS") {
                onPointShortage(response.shortfall);
                return;
            }

            // それ以外は正常
            setMessage(`${response.message}`);

            // ステータス変更成功後、一覧を更新（`onStatusChange` があれば実行）
            if (onStatusChange) {
                onStatusChange();
            }

        } catch (error) {
            setMessage("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleClick}
                style={{ backgroundColor: color }}
                className="px-4 py-2 rounded text-white hover:opacity-80 transition-opacity duration-200 disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "処理中..." : label}
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
}
