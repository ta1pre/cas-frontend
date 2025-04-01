import { useState, useCallback } from 'react';
import { fetchAPI } from '@/services/auth/axiosInterceptor';
import { Post, PostCreateData, PostUpdateData, PostDeleteData } from '../types';

/**
 * 投稿機能のAPI連携用カスタムフック
 */
export const usePosts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 投稿一覧を取得する
   * @param castId キャストID
   * @param skip スキップする件数
   * @param limit 取得件数上限
   * @returns 投稿一覧
   */
  const fetchPosts = useCallback(async (castId: number, skip = 0, limit = 20): Promise<Post[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        `/api/v1/posts/cast`,
        { cast_id: castId, skip, limit }
      );
      
      if (!response) {
        throw new Error('投稿の取得に失敗しました');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || '投稿の取得に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 投稿詳細を取得する
   * @param postId 投稿ID
   * @returns 投稿詳細
   */
  const fetchPostDetail = useCallback(async (postId: number): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        `/api/v1/posts/detail`,
        { post_id: postId }
      );
      
      if (!response) {
        throw new Error('投稿の取得に失敗しました');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || '投稿の取得に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 投稿を作成する
   * @param postData 投稿データ
   * @returns 作成された投稿
   */
  const createPost = useCallback(async (postData: PostCreateData): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        '/api/v1/posts/create',
        postData
      );
      
      if (!response) {
        throw new Error('投稿の作成に失敗しました');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || '投稿の作成に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 投稿を更新する
   * @param postData 更新データ
   * @returns 更新された投稿
   */
  const updatePost = useCallback(async (postData: PostUpdateData): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        '/api/v1/posts/update',
        postData
      );
      
      if (!response) {
        throw new Error('投稿の更新に失敗しました');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || '投稿の更新に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 投稿を削除する
   * @param postId 削除する投稿ID
   * @returns 削除成功フラグ
   */
  const deletePost = useCallback(async (postId: number): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        `/api/v1/posts/delete`,
        { id: postId }
      );
      
      if (!response) {
        throw new Error('投稿の削除に失敗しました');
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || '投稿の削除に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 投稿にいいねを追加する
   * @param postId いいねする投稿ID
   * @returns 更新された投稿
   */
  const likePost = useCallback(async (postId: number): Promise<Post> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        `/api/v1/posts/like`,
        { post_id: postId }
      );
      
      if (!response) {
        throw new Error('いいねの追加に失敗しました');
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'いいねの追加に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchPosts,
    fetchPostDetail,
    createPost,
    updatePost,
    deletePost,
    likePost,
    loading,
    error
  };
};

export default usePosts;
