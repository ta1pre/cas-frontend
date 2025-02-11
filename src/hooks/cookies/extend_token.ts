// path: middleware/refreshToken.ts

import Cookies from 'js-cookie'
import { NextRequest } from "next/server"

/**
 * `/refresh` を叩いて token を更新する
 */
export const refreshToken = async (request: NextRequest): Promise<string | null> => {
  try {
    console.log("🚀 `refreshToken` 実行開始...");

    // ★ まず cookie から token を取得して、有効期限をチェック ★
    const token = request.cookies.get("token")?.value;
    if (token) {
      const tokenExp = getTokenExpiration(token);  // token の有効期限 (UNIX秒) を取得
      const now = Math.floor(Date.now() / 1000);
      // 残り時間が 180秒 (3分) より多い場合、refresh は不要なので token をそのまま返す
      if (tokenExp && (tokenExp - now) > 3 * 60) {
        console.log("✅ token の残り時間が十分にあるため、refresh は不要");
        return token;
      }
    }

    // ★ 以下は元々の refreshToken 処理（tokenの残り時間が3分以下の場合のみ実行） ★

    // 環境変数から API URL を取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ `NEXT_PUBLIC_API_URL` が設定されていません");
      return null;
    }

    const refreshEndpoint = `${apiUrl}/api/v1/account/auth/refresh`;
    console.log("🌍 `refreshToken` 送信先:", refreshEndpoint);

    // リクエストの Cookie から local_token を取得
    const localToken = request.cookies.get("local_token")?.value;
    if (!localToken) {
      console.warn("⛔ `local_token` が見つかりません");
      return null;
    }
    console.log("🔍 `refreshToken` 取得した local_token:", localToken);

    // /refresh エンドポイントを叩く
    const response = await fetch(refreshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localToken}`,
        'Cookie': request.headers.get('cookie') || "",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ `/refresh` API エラー:", errorData);
      throw new Error(errorData.detail || "`token` を更新できませんでした");
    }

    const data = await response.json();
    console.log("✅ `refreshToken` 新しい token を取得:", data.token);

    // ここではクッキーへの書き込みは行わず、新しい token を返す
    return data.token;
  } catch (error) {
    console.error("❌ `refreshToken` 実行エラー:", error);
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
          console.error("❌ token のフォーマットが不正です");
          return null;
      }

      const decodedPayload = JSON.parse(atob(tokenParts[1])); // JWT のデコード
      if (!decodedPayload.exp) {
          console.error("❌ token に `exp` が含まれていません");
          return null;
      }

      console.log(`✅ token の有効期限 (UNIX秒): ${decodedPayload.exp}`);
      return decodedPayload.exp;
  } catch (error) {
      console.error("❌ token の有効期限取得に失敗:", error);
      return null;
  }
};
