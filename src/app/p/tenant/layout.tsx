import React from "react";
import TenantLayout from './components/TenantLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TenantLayout>
      {children}
    </TenantLayout>
  );
}
