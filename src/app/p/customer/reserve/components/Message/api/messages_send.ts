import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function sendMessage(reservationId: number, message: string): Promise<{ message_id: number, status: string } | null> {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log("📡 `POST /api/v1/reserve/common/messages_send` をリクエスト:", { 
            user_id: user.userId, 
            reservation_id: reservationId, 
            sender_type: "user",  // ✅ sender_type を追加
            message 
        });

        const response = await fetchAPI("/api/v1/reserve/common/messages_send", {
            user_id: user.userId,
            reservation_id: reservationId,
            sender_type: "user",  // ✅ 追加
            message
        });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
