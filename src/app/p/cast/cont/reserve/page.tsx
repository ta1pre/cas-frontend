// 📂 src/app/p/cast/cont/reserve/page.tsx
"use client";

import ReserveList from "./components/ReserveList";

export default function CastReservePage() {
  return (
    <div style={{ padding: '16px' }}>
      <h1>キャスト予約ページ</h1>
      <ReserveList />
    </div>
  );
}
