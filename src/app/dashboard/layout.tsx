'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2>ダッシュボード共通レイアウト</h2>
      {children}
    </div>
  );
}
