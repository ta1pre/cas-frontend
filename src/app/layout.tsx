import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth/AuthProvider';
import ThemeProviderClient from '@/components/theme/ThemeProviderClient';


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ThemeProviderClient> 
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
