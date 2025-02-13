// frontapp/src/hooks/cookies/extend_token.ts

import Cookies from 'js-cookie'
import { NextRequest } from "next/server"

/**
 * `/refresh` を叩いて token を更新する
 */
/**
 * `/refresh` を叩いて token を更新する
 */
export const refreshToken = async (request?: NextRequest): Promise<string | null> => {
  try {
    console.log("🚀 【extend_token.ts】`refreshToken` 実行開始...");

    let refreshToken: string | null = null;

    // ✅ クライアント or サーバーを判定
    if (typeof window !== "undefined") {
      // ✅ クライアント側: `document.cookie` から取得
      refreshToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("refresh_token="))
        ?.split("=")[1] || null;
    } else if (request) {
      // ✅ サーバー側: `request.cookies.get()` から取得
      refreshToken = request.cookies.get("refresh_token")?.value || null;
    }

    if (!refreshToken) {
      console.warn("⛔ 【extend_token.ts】`refresh_token` が見つかりません");
      return null;
    }

    console.log("✅ 【extend_token.ts】取得した `refresh_token`:", refreshToken);

    // 環境変数から API URL を取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ 【extend_token.ts】`NEXT_PUBLIC_API_URL` が設定されていません");
      return null;
    }

    const refreshEndpoint = `${apiUrl}/api/v1/account/auth/refresh`;

    console.log("🌍 【extend_token.ts】`refreshToken` 送信先:", refreshEndpoint);

    // `/refresh` エンドポイントを叩く
    const response = await fetch(refreshEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ 【extend_token.ts】`/refresh` API エラー:", errorData);
      throw new Error(errorData.detail || "`token` を更新できませんでした");
    }

    const data = await response.json();
    console.log("✅ 【extend_token.ts】`refreshToken` 新しい token を取得:", data.token);

    return data.token;
  } catch (error) {
    console.error("❌ 【extend_token.ts】`refreshToken` 実行エラー:", error);
    return null;
  }
};

/**
 * token の有効期限を取得（サーバーサイド対応）
 */
export const getTokenExpiration = (token: string | undefined): number | null => {
  try {
      if (!token) {
          console.warn("⚠️ token が見つかりません");
          return null;
      }

      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
          console.error("【extend_token.ts】❌ token のフォーマットが不正です");
          return null;
      }

      const decodedPayload = JSON.parse(atob(tokenParts[1])); // JWT のデコード
      if (!decodedPayload.exp) {
          console.error("【extend_token.ts】❌ token に `exp` が含まれていません");
          return null;
      }

      console.log(`【extend_token.ts】✅ token の有効期限 (UNIX秒): ${decodedPayload.exp}`);
      return decodedPayload.exp;
  } catch (error) {
      console.error("【extend_token.ts】❌ token の有効期限取得に失敗:", error);
      return null;
  }
};
