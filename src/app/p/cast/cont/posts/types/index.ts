// 投稿の型定義
export interface Post {
  id: number;
  cast_id: number;
  body: string;
  photo_url?: string;
  status: 'public' | 'private' | 'draft';
  created_at: string;
  updated_at?: string;
  likes_count: number;
}

// 投稿作成用の型定義
export interface PostCreateData {
  body: string;
  photo_url?: string;
  status: 'public' | 'private' | 'draft';
}

// 投稿更新用の型定義
export interface PostUpdateData {
  id: number; // 投稿ID
  body?: string;
  photo_url?: string;
  status?: 'public' | 'private' | 'draft';
}

// 投稿削除用の型定義
export interface PostDeleteData {
  id: number;
}
