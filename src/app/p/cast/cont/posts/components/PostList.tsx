import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, CardActions, Button, Grid, Chip, IconButton, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import usePosts from '../api/usePosts';
import { Post } from '../types';
import useUser from '@/hooks/useUser';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 アスペクト比
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
}));

interface PostListProps {
  castId: number;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  refreshTrigger?: number; // 再読み込みをトリガーするためのプロパティ
}

const PostList: React.FC<PostListProps> = ({ castId, onEdit, onDelete, refreshTrigger = 0 }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, error, fetchPosts, likePost } = usePosts();
  const user = useUser();
  // cast_idが存在しない場合は、現在表示中のcastIdを使用する
  const currentCastId = castId;

  // 投稿を読み込む関数
  const loadPosts = async () => {
    try {
      const data = await fetchPosts(castId);
      setPosts(data || []);
    } catch (error) {
      console.error('投稿の取得に失敗しました:', error);
    }
  };

  // コンポーネントマウント時とrefreshTriggerが変わった時に投稿を読み込む
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await fetchPosts(castId);
        if (isMounted) {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('投稿の取得に失敗しました:', error);
      }
    };
    
    fetchData();
    
    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, [castId, fetchPosts, refreshTrigger]); // refreshTriggerを依存配列に追加

  const handleLike = async (postId: number) => {
    try {
      const updatedPost = await likePost(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('いいねの追加に失敗しました:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'public': return 'success';
      case 'private': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'public': return '公開';
      case 'private': return '非公開';
      case 'draft': return '下書き';
      default: return status;
    }
  };

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          投稿一覧
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography color="error" variant="h6">
          エラーが発生しました: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        投稿一覧
      </Typography>
      
      {posts.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          投稿がありません。新しい投稿を作成してみましょう！
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <StyledCard>
                {post.photo_url && (
                  <StyledCardMedia
                    image={post.photo_url}
                    title={`投稿 ${post.id}`}
                  />
                )}
                <StyledCardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={getStatusLabel(post.status)} 
                      color={getStatusColor(post.status) as any} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                    {post.body.length > 10 ? `${post.body.substring(0, 10)}...` : post.body}
                  </Typography>
                </StyledCardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    startIcon={<FavoriteIcon />}
                    onClick={() => handleLike(post.id)}
                    color="primary"
                    size="small"
                  >
                    いいね {post.likes_count}
                  </Button>
                  
                  {currentCastId === post.cast_id && (
                    <Box>
                      {onEdit && (
                        <IconButton onClick={() => onEdit(post)} size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton onClick={() => onDelete(post.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PostList;
