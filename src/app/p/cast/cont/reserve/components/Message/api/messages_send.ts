import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function sendMessage(reservationId: number, message: string): Promise<{ message_id: number, status: string } | null> {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("キャストユーザー情報が取得できません");
        return null;
    }

    try {
        console.log("`POST /api/v1/reserve/common/messages_send` をリクエスト:", { 
            user_id: user.userId, 
            reservation_id: reservationId, 
            sender_type: "cast",  // 送信者タイプをcastに設定
            message 
        });

        const response = await fetchAPI("/api/v1/reserve/common/messages_send", {
            user_id: user.userId,
            reservation_id: reservationId,
            sender_type: "cast",  // castとして送信
            message
        });

        console.log("APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("APIエラー:", error);
        return null;
    }
}
