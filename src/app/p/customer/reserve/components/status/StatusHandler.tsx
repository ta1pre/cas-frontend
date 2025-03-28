import { useState, useEffect } from "react";
import StatusButton from "./StatusButton";
import PointShortageModal from "./PointShortageModal";
import useUser from "@/hooks/useUser";
import fetchCustomerReserve from "../../api/resvlist";

interface StatusHandlerProps {
    reservationId: number;
    statusKey: string;
    onUpdate?: () => Promise<void>;
    status?: string;
    colorCode?: string;
}

const fallbackStatusConfig: Record<string, { text: string; subText?: string; buttons?: { label: string; nextStatus: string; color: string }[] }> = {
    requested: { text: "🔄 キャスト確認中" },
    adjusting: { text: "⚙️ 予約調整中" },
    waiting_user_confirm: {
        text: "",
        buttons: [
            { label: "予約確定", nextStatus: "confirmed", color: "green" },
            { label: "修正依頼", nextStatus: "adjusting", color: "orange" },
        ],
    },
    confirmed: { 
        text: "✅ 予約確定済み", 
        subText: "待ち合わせ場所に到着したら下の到着ボタンを押して下さい。",
        buttons: [
            { label: "到着しました", nextStatus: "user_arrived", color: "blue" },
        ],
    },
    user_arrived: { 
        text: "🚫 お客様到着済み", 
        subText: "キャスト到着までしばらくお待ち下さい。",
    },
};

export default function StatusHandler({ reservationId, statusKey, status, colorCode, onUpdate }: StatusHandlerProps) {
    const fallbackConfig = fallbackStatusConfig[statusKey] || { text: "❓ 未知のステータス" };

    const [displayText, setDisplayText] = useState<string>(status || fallbackConfig.text);
    const [displaySubText, setDisplaySubText] = useState<string | undefined>(fallbackConfig.subText);
    const [bgColor, setBgColor] = useState<string>(colorCode || "bg-gray-100");

    const [shortfall, setShortfall] = useState<number | null>(null);
    const user = useUser();

    useEffect(() => {
        if (status) {
            setDisplayText(status);
        }
        if (colorCode) {
            setBgColor(colorCode);
        }
    }, [status, colorCode]);

    return (
        <div className={`p-2 mt-4 rounded text-center ${bgColor}`}>
            <p className="font-semibold">📌 予約ID: {reservationId}</p>
            <p className="text-lg font-medium">{displayText}</p>
            {displaySubText && (
                <p className="text-md text-gray-600 mt-2">{displaySubText}</p>
            )}

            {fallbackConfig.buttons && (
                <div className="mt-2 flex justify-center gap-2">
                    {fallbackConfig.buttons.map((button) => (
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
                            }}
                        />
                    ))}
                </div>
            )}

            <PointShortageModal 
                shortfall={shortfall} 
                reservationId={reservationId} 
                userId={user?.user_id ?? 0} 
                onClose={() => setShortfall(null)}
                onPurchase={onUpdate}
            />
        </div>
    );
}
