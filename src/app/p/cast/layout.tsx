// 📂 src/app/p/cast/layout.tsx

import React from "react";
import CastClientLayout from "./components/layout/CastClientLayout";

export default function CastLayout({ children }: { children: React.ReactNode }) {
  return (
    <CastClientLayout>
      {children}
    </CastClientLayout>
  );
}
