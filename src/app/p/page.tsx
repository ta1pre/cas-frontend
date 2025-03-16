// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";

export default function Page() {
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
