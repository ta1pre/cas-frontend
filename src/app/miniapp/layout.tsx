// src/app/miniapp/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PreCas - LINE ミニアプリ',
  description: 'PreCasの公式LINEに登録',
}

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {children}
    </div>
  )
}