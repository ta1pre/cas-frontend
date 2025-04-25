"use client";
import { AuthProvider } from "@/context/auth/AuthProvider";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
