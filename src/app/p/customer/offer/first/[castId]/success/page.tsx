"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ クエリパラメータからデータを取得
  const castId = searchParams.get("castId");
  const userId = searchParams.get("userId");
  const timeOption = searchParams.get("timeOption"); // "fast" or "custom"
  const station = searchParams.get("station");
  const courseName = searchParams.get("courseName"); // "light" or "full" or コース名
  const message = searchParams.get("message") || "なし";

  // ✅ カスタム日時（日時指定の場合のみ有効）
  const date = searchParams.get("date"); // 例: 2025-03-09T07:00:00.000Z
  const hour = searchParams.get("hour"); // 例: 10:00

  return (
    <Box className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <CheckCircleIcon sx={{ fontSize: "4rem", color: "#22c55e" }} />
      <Typography variant="h5" className="font-bold mt-4">
        予約リクエスト送信完了！
      </Typography>
      <Typography className="text-gray-600 mt-2">
        リクエストが送信されました 🎉
      </Typography>

      {/* ✅ 送信内容の確認 */}
      <Box className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-md text-sm">
        <Typography>
          <strong>キャストID:</strong> {castId}
        </Typography>
        <Typography>
          <strong>ユーザーID:</strong> {userId}
        </Typography>

        {/* ✅ 日時指定の表示切り替え */}
        <Typography>
          <strong>時間指定:</strong>{" "}
          {timeOption === "fast"
            ? "最速案内"
            : date && hour
            ? `希望日時: ${date} ${hour}`
            : "希望日時（情報なし）"}
        </Typography>

        <Typography>
          <strong>希望駅:</strong> {station}
        </Typography>

        {/* ✅ コース名だけ表示 */}
        <Typography>
          <strong>コース:</strong> {courseName}
        </Typography>

        <Typography>
          <strong>メッセージ:</strong> {message}
        </Typography>
      </Box>

      {/* ✅ 戻るボタン */}
      <Button
        variant="contained"
        sx={{ mt: 4, py: 2, px: 6, backgroundColor: "#22c55e" }}
        onClick={() => router.push("/p/customer/offer")}
      >
        ホームに戻る
      </Button>
    </Box>
  );
}
