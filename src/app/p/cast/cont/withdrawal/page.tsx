"use client";
import { useState } from "react";
import WithdrawalForm from "./components/WithdrawalForm";
import WithdrawalHistory from "./components/WithdrawalHistory";

export default function WithdrawalPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <WithdrawalForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      {/* keyを変えることで履歴を再マウント→再フェッチ */}
      <WithdrawalHistory key={refreshKey} />
    </div>
  );
}
