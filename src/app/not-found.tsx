"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900 p-6">
      {/* アイコン */}
      <MdOutlineErrorOutline className="text-6xl text-blue-500 mb-4" />

      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-2">404 - ページが見つかりません</h1>
      <p className="text-gray-600 text-center max-w-xs">
        お探しのページは存在しないか、URLが間違っている可能性があります。
      </p>

      {/* ホームに戻るボタン */}
      <Button
        variant="contained"
        color="primary"
        className="mt-6 w-full max-w-xs"
        onClick={() => router.push("/")}
      >
        ホームに戻る
      </Button>
    </div>
  );
}
