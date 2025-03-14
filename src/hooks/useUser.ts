//src/hooks/useUser.ts
"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ `DecodedToken` の型に `token` を追加
interface DecodedToken {
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

  useEffect(() => {
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
        setUser({ ...decodedUser, token: foundToken }); // ✅ `token` を追加
        console.log("👤 デコードされたユーザー情報:", decodedUser);
      } catch (error) {
        console.error("🔴 トークンのデコードに失敗:", error);
      }
    } else {
      console.log("⚠️ `token` がクッキーにありません");
    }
  }, []);

  return user; // ✅ `user.token` を含めたオブジェクトを返す
};

export default useUser;
