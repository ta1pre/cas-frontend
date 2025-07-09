//src/hooks/useUser.ts
"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ `DecodedToken` の型に `token` を追加
export interface DecodedToken {
  token: string;  // ✅ `token` を追加
  user_id: number;
  user_type: string;
  exp: number;
}

/**
 * ✅ `useUser()` フック: クッキーから `token` を取得し、デコードした `user` に `token` を追加
 */
const useUser = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 useUser useEffect 実行");
    const cookies = document.cookie.split("; ");
    console.log("🍪 取得したクッキー一覧:", cookies);

    let foundToken: string | null = null;
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "token") {
        foundToken = value;
        console.log("✅ 正しい `token` を取得:", value);
        break;
      }
    }

    if (foundToken) {
      try {
        const decodedUser = jwtDecode<Omit<DecodedToken, "token">>(foundToken);
        const userWithToken = { ...decodedUser, token: foundToken };
        setUser(userWithToken);
        console.log("👤 デコードされたユーザー情報:", decodedUser);
      } catch (error) {
        console.error("🔴 トークンのデコードに失敗:", error);
        setUser(null);
      }
    } else {
      console.log("⚠️ `token` がクッキーにありません");
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  console.log("🔄 useUser hook 実行", { user: user?.user_id, isLoading });
  return user;
};

export default useUser;
