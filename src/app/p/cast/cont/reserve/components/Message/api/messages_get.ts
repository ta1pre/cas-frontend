import { fetchAPI } from "@/services/auth/axiosInterceptor";

export interface Message {
    message_id: number;
    sender_id?: number;
    sender_type: "user" | "cast" | "admin";
    content: string;
    sent_at: string;
}

export default async function fetchMessages(reservationId: number): Promise<{ messages: Message[] } | null> {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 キャストユーザー情報が取得できません");
        return null;
    }

    try {
        console.log("📡 `POST /api/v1/reserve/common/messages_get` をリクエスト:", { user_id: user.userId, reservation_id: reservationId });

        const response = await fetchAPI("/api/v1/reserve/common/messages_get", {
            user_id: user.userId,
            reservation_id: reservationId
        });

        console.log("✅ APIレスポンス:", response);
        return response; // ✅ APIのデータ構造をそのまま返す
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.warn("⚠️ メッセージが見つかりません");
            return { messages: [] };
        }
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
