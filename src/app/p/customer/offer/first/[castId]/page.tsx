"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import OfferHeader from "./components/OfferHeader";
import TimeSelector from "./components/TimeSelector";
import StationSelector from "./components/StationSelector";
import CourseSelector from "./components/CourseSelector";
import MessageInput from "./components/MessageInput";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

export default function FirstOfferPage() {
  const params = useParams();
  const castId = params.castId ? Number(params.castId) : 0;
  const router = useRouter();
  const userId = 41;

  // 状態管理
  const [timeOption, setTimeOption] = useState<"fast" | "custom">("fast");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customTime, setCustomTime] = useState<string | null>(null);

  const [station, setStation] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ✅ TimeSelector からのコールバックを受け取る
  const handleTimeChange = (option: "fast" | "custom", date: Date | null, time: string | null) => {
    setTimeOption(option);
    setCustomDate(date);
    setCustomTime(time);
  };

  const handleSubmit = () => {
    if (!station || !courseName) return; // 必須項目が未選択なら送信しない

    console.log("🚀 予約リクエスト送信:", {
      castId,
      userId,
      timeOption,   // "fast" or "custom"
      date: customDate?.toISOString() || null,
      time: customTime,
      station,
      courseName,
      message,
    });

    // クエリパラメータとしても送る例
    const dateParam = customDate ? customDate.toISOString() : "";
    const url = `/p/customer/offer/first/${castId}/success`
      + `?castId=${castId}`
      + `&userId=${userId}`
      + `&timeOption=${timeOption}`
      + `&station=${station}`
      + `&courseName=${courseName}`
      + `&message=${message}`
      + `&date=${dateParam}`
      + `&hour=${customTime || ""}`;

    router.push(url);
  };

  return (
    <Box className="w-full bg-gray-100 pb-20">
      <OfferHeader castId={castId} />

      <Typography
        className="text-xs text-gray-600 text-center"
        sx={{
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          padding: "6px 12px",
          maxWidth: "90%",
          margin: "12px auto",
        }}
      >
        💡 ポイント消費はありません
      </Typography>

      {/* 日時選択 */}
      <TimeSelector onTimeChange={handleTimeChange} />

      {/* 駅選択 */}
      <StationSelector userId={userId} castId={castId} onSelectStation={setStation} />

      {/* コース選択 */}
      <CourseSelector castId={castId} onSelectCourse={(c) => setCourseName(c?.course_name || null)} />

      <MessageInput value={message} onChange={setMessage} />

      {/* 送信ボタン */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)",
          p: 2,
          textAlign: "center",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 2,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "999px",
            backgroundColor: station && courseName ? "#22c55e" : "#e5e7eb",
            color: station && courseName ? "#fff" : "#a1a1a1",
            "&:hover": {
              backgroundColor: station && courseName ? "#16a34a" : "#d1d5db",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
          }}
          onClick={handleSubmit}
          disabled={!station || !courseName}
        >
          予約リクエストを送信
          <TrendingFlatIcon sx={{ fontSize: "1.5rem" }} />
        </Button>
      </Box>
    </Box>
  );
}
