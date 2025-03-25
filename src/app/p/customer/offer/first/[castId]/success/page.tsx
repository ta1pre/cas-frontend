"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { sendReservationRequest } from "./api/reservation";
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from "@mui/material";
import Link from "next/link";

// Suspense内でuseSearchParamsを使用するコンポーネント
function SuccessContent() {
  const searchParams = useSearchParams();

  const castId = Number(searchParams.get("castId"));
  const userId = Number(searchParams.get("userId"));
  const timeOption = searchParams.get("timeOption") || "fast";
  const station = Number(searchParams.get("station"));
  const courseName = searchParams.get("courseName") || "";
  const courseType = Number(searchParams.get("courseType"));
  const message = searchParams.get("message") || "";
  const date = searchParams.get("date");
  const hour = searchParams.get("hour");

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("📡 URL パラメータ:", {
      castId,
      userId,
      timeOption,
      station,
      courseName,
      courseType,
      message,
      date,
      hour,
    });

    sendReservationRequest(
      castId,
      userId,
      timeOption,
      station,
      courseName,
      courseType,
      message,
      date,
      hour
    )
      .then((res) => {
        if (res && res.reservation_id) {
          console.log("🎉 予約成功:", res);
          setReservationId(res.reservation_id);
          setIsSuccess(true);
        } else {
          setError("予約に失敗しました。再度お試しください。");
        }
      })
      .catch((error) => {
        console.error("🚨 予約リクエストエラー:", error);
        setError("サーバーエラーが発生しました。しばらくしてから再試行してください。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black px-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress className="text-white" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg mx-4">
          <Alert severity="error">{error}</Alert>
        </div>
      ) : isSuccess ? (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg mx-4">
          <CardContent>
            <Typography variant="h6" className="font-bold text-center">予約リクエスト完了！</Typography>
            <Typography variant="body1" className="mt-2 text-center">
              Reservation ID: {reservationId}
            </Typography>

            <Typography variant="body2" className="mt-2">
              予約内容の確認や変更は、下のボタンから行えます。
            </Typography>
            <div className="flex justify-center mt-4">
              <Link href="/p/customer/reserve">
                <Button variant="contained" color="primary">
                  予約を確認する
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg mx-4">
          <Alert severity="error">予約処理に失敗した可能性があります。</Alert>
        </div>
      )}
    </div>
  );
}

// メインコンポーネント
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-black"><CircularProgress className="text-white" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
