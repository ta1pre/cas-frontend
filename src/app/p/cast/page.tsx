"use client";

import { useCastUser } from "@/app/p/cast/hooks/useCastUser";

export default function CastPageTSX() {
  const user = useCastUser();  // ✅ これ1行で完結！！！

  return (
    <div style={{ padding: '16px' }}>
      <h1>キャスト予約ページ</h1>
      <p><strong>ユーザーID:</strong> {user.user_id}</p>
      <p><strong>ユーザータイプ:</strong> {user.user_type}</p>
      <p><strong>トークン:</strong> {user.token}</p>
      <p><strong>有効期限:</strong> {user.exp}</p>
    </div>
  );
}
