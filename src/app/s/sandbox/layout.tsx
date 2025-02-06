'use client';

import React from 'react';

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-hidden">{children}</div>
  );
}
