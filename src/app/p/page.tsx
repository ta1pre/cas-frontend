// src/app/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function PageContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ロード中なら何もしない

    if (isAuthenticated && user) {
      if (user.userType === "customer") {
        router.replace("/p/customer/search");
      } else if (user.userType === "cast") {
        router.replace("/p/cast");
      }
    }
  }, [user, isAuthenticated, loading, router]);

  return null; // 何も表示しない
}

// メインのページコンポーネント
export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>🔄 読み込み中...</p></div>}>
      <PageContent />
    </Suspense>
  );
}
