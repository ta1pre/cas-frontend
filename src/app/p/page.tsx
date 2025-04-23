// src/app/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";
import Cookies from "js-cookie";

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function PageContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ロード中なら何もしない

    // StartPageクッキーの値を取得
    const startPage = Cookies.get('StartPage');
    
    // StartPageの値がcast:casまたはcast:precasならp/cast/cont/dashboardへリダイレクト
    if (startPage && (startPage === 'cast:cas' || startPage === 'cast:precas')) {
      router.replace("/p/cast/cont/dashboard");
      return;
    }

    if (isAuthenticated && user) {
      if (user.userType === "customer") {
        router.replace("/p/customer/search");
      } else if (user.userType === "cast") {
        router.replace("/p/cast/cont/dashboard");
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
