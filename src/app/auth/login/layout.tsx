import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PreCas - 大人なP活専門アプリ',
  description: '大人なP活専門アプリ PreCas。安心・安全な出会いをサポートします。',
  openGraph: {
    title: 'PreCas - 大人なP活専門アプリ',
    description: '大人なP活専門アプリ PreCas。安心・安全な出会いをサポートします。',
    url: '/auth/login',
    siteName: 'PreCas',
    type: 'website',
    images: [
      {
        url: '/images/common/precas.jpg',
        width: 1200,
        height: 630,
        alt: 'PreCas - 大人なP活専門アプリ',
      },
    ],
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PreCas - 大人なP活専門アプリ',
    description: '大人なP活専門アプリ PreCas。安心・安全な出会いをサポートします。',
    images: ['/images/common/precas.jpg'],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}