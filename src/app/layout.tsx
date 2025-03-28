import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth/AuthProvider';
import ThemeProviderClient from '@/components/theme/ThemeProviderClient';
import { Suspense } from 'react'; 


export const metadata: Metadata = {
  title: 'Cas(キャス)',
  description: 'マッチングサービスの総合アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ThemeProviderClient> 
          {/* AuthProviderをSuspenseでラップ */}
          <Suspense fallback={<div>Loading auth...</div>}> 
            <AuthProvider>
              {children}
            </AuthProvider>
          </Suspense>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
