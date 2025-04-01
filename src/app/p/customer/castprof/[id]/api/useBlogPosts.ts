// src/app/p/customer/castprof/[id]/api/useBlogPosts.ts
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

export interface BlogPost {
  id: number;
  cast_id: number;
  title?: string;
  body: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  status: 'public' | 'private';
  media_id?: number;
}

export const useBlogPosts = (castId: number) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!castId) {
        setError('キャストIDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        console.log(`[useBlogPosts] キャストID ${castId} のブログ投稿を取得中...`);
        
        // fetchAPIを使用してブログ投稿を取得（キャスト側の実装を参考）
        const response = await fetchAPI(
          `/api/v1/posts/cast`,
          { cast_id: castId, status: 'public' }
        );

        if (response && Array.isArray(response)) {
          console.log(`[useBlogPosts] ${response.length} 件のブログ投稿を取得しました`);
          setPosts(response);
        } else {
          console.log('[useBlogPosts] ブログ投稿が見つかりませんでした');
          setPosts([]);
        }
      } catch (err) {
        console.error('[useBlogPosts] ブログ投稿の取得に失敗しました:', err);
        setError('ブログ投稿の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [castId]);

  return { posts, loading, error };
};
