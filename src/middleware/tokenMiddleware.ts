// File: /middleware/tokenMiddleware.ts
// このファイルは、リクエスト時に refreshToken を呼び出して token を更新し、
// 取得した token をブラウザのクッキーに書き込むミドルウェアです。

import { NextRequest, NextResponse } from "next/server";
// frontapp/src/hooks/cookies/extend_token.ts から refreshToken を読み込みます。
import { refreshToken } from "../hooks/cookies/extend_token";

const tokenMiddleware = async (request: NextRequest): Promise<NextResponse> => {
  try {
    console.log("🚀 [tokenMiddleware] refreshToken を実行して token を更新します...");

    // refreshToken を実行して新しい token を取得
    const token = await refreshToken(request);
    if (!token) {
      console.warn("⛔ [tokenMiddleware] refreshToken が null を返しました。");
      // token が取得できなかった場合はそのままリクエストを継続
      return NextResponse.next();
    }

    // リクエストをそのまま次へ流すためのレスポンスオブジェクトを作成
    const response = NextResponse.next();

    // Next.js の response.cookies.set() を利用して token をクッキーに設定
    response.cookies.set("token", token, {
      path: "/",            // ルート以下全てで有効
      secure: true,         // HTTPS環境でのみ有効（開発環境がHTTPの場合は false に変更）
      sameSite: "none",     // クロスサイト対応
      httpOnly: false,      // クライアントサイドからも読み取れる（必要に応じて true に変更）
      maxAge: 3600,         // 有効期限は 1 時間（秒単位）
    });

    console.log("✅ [tokenMiddleware] token クッキーが更新されました:", token);
    return response;
  } catch (error) {
    console.error("❌ [tokenMiddleware] エラーが発生:", error);
    return NextResponse.next();
  }
};

export default tokenMiddleware;
