import { fetchAPI } from "@/services/auth/axiosInterceptor";

export async function sendReservationRequest(
  castId: number,
  userId: number,
  timeOption: string,
  station: number,
  courseName: string,
  courseType: number,  // ✅ `courseType` を引数で受け取る
  message: string,
  date: string | null,
  hour: string | null
) {
  try {
    const payload = {
      castId,
      userId,
      timeOption,
      station: Number(station),  // ✅ 数値変換
      courseName,
      courseType: Number(courseType),  // ✅ ここを修正
      message: message || "",
      date: date || null,  // ✅ `null` を `None` として送れるように
      time: hour || null,  // ✅ `null` を許可
    };

    console.log("📡 `POST /offer` をリクエスト:", JSON.stringify(payload));

    const response = await fetchAPI("/api/v1/reserve/customer/offer", payload);

    console.log("✅ 予約リクエスト成功:", response);
    return response;
  } catch (error: any) {
    console.error("🚨 予約リクエスト失敗:", error);
    return null;
  }
}
