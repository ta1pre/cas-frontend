"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sendReservationRequest } from "./api/reservation";

export default function SuccessPage() {
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

  // ✅ ステート管理
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<number|null>(null);

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
        // ✅ 成功時
        if (res && res.reservation_id) {
          console.log("🎉 予約成功:", res);
          setReservationId(res.reservation_id);
          setIsSuccess(true);
        } else {
          console.log("🚨 予約APIは200だが、reservation_idがありません", res);
        }
      })
      .catch((error) => {
        console.error("🚨 予約リクエストエラー:", error);
      })
      .finally(() => {
        // ✅ ローディング完了
        setIsLoading(false);
      });
  }, []);

  // ✅ ローディング中なら「処理中」表示
  if (isLoading) {
    return <div>予約処理中...</div>;
  }

  // ✅ 成功したら結果を表示
  if (isSuccess) {
    return (
      <div>
        <p>予約が完了しました！</p>
        <p>Reservation ID: {reservationId}</p>
        {/* 他の情報を表示するなど */}
      </div>
    );
  }

  // ✅ 失敗 or 予約IDなしの場合
  return (
    <div>
      <p>予約処理に失敗した可能性があります。</p>
      {/* リトライボタンなど */}
    </div>
  );
}
