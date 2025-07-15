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
    console.log('🎯 /p PageContent useEffect:', { 
      loading, 
      isAuthenticated, 
      user,
      userType: user?.userType,
      userId: user?.userId 
    });

    if (loading) {
      console.log('⏳ Still loading...');
      return; // ロード中なら何もしない
    }

    // StartPageクッキーの値を取得
    const startPage = Cookies.get('StartPage');
    console.log('🍪 StartPage cookie:', startPage);
    
    // StartPageの値がcast:casまたはcast:precasならp/cast/cont/dashboardへリダイレクト
    if (startPage && (startPage === 'cast:cas' || startPage === 'cast:precas')) {
      console.log('➡️ Redirecting to cast dashboard based on StartPage cookie');
      router.replace("/p/cast/cont/dashboard");
      return;
    }

    if (isAuthenticated && user) {
      console.log('✅ User authenticated, checking userType:', user.userType);
      
      if (user.userType === "customer") {
        console.log('➡️ Redirecting to customer search');
        router.replace("/p/customer/search");
      } else if (user.userType === "cast") {
        console.log('➡️ Redirecting to cast dashboard');
        router.replace("/p/cast/cont/dashboard");
      } else {
        console.warn('⚠️ Unknown userType:', user.userType);
      }
    } else {
      console.log('⚠️ User not authenticated or user data not available');
    }
  }, [user, isAuthenticated, loading, router]);

  // ローディング中は何か表示する
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>🔄 認証情報を確認中...</p>
      </div>
    );
  }

  // 認証されていない場合
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>⏳ リダイレクト中...</p>
      </div>
    );
  }

  return null; // リダイレクト待機中
}

// メインのページコンポーネント
export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense fallback={<p>🔄 読み込み中...</p>}>
        <PageContent />
      </Suspense>
    </div>
  );
}
