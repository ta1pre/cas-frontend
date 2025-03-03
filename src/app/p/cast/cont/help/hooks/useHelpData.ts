// p/cast/help/hooks/useHelpData.ts
// MicroCMS API からヘルプ記事データを取得するカスタムフック

import { useEffect, useState } from 'react';

const API_URL = 'https://23t441tj5w.microcms.io/api/v1/help?limit=100';
const API_KEY = 'znTrSMC5Y4KxNITfqJnRjmRWB85KTjJtPg5b';

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: {
    id: string;
    name: string;
  };
  adult: boolean;
}

export function useHelpData() {
  const [helpItems, setHelpItems] = useState<HelpArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHelpData() {
      try {
        const response = await fetch(API_URL, {
          headers: { 'X-MICROCMS-API-KEY': API_KEY },
        });
        const data = await response.json();

        // API の contents 配列から必要な項目を抽出
        const formattedData: HelpArticle[] = data.contents.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          category: {
            id: item.category.id,
            name: item.category.name,
          },
          adult: item.adult,
        }));

        setHelpItems(formattedData);
      } catch (err) {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchHelpData();
  }, []);

  return { helpItems, error, loading };
}
