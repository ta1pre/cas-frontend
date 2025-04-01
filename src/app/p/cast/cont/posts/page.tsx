"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import { Post } from './types';
import usePosts from './api/usePosts';
import useUser from '@/hooks/useUser';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const PostsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { deletePost } = usePosts();
  const user = useUser();
  const castId = user?.user_id;
  // 投稿リストの再読み込みをトリガーするための状態
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateClick = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPost(null);
    setNotification({ 
      type: 'success', 
      message: editingPost ? '投稿を更新しました' : '新しい投稿を作成しました'
    });
    // 投稿作成・更新後にリストを更新
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setNotification({ type: 'success', message: '投稿を削除しました' });
        // 削除後にリストを更新するためのトリガーを更新
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('投稿の削除に失敗しました:', error);
        setNotification({ type: 'error', message: '投稿の削除に失敗しました' });
      }
    }
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Container maxWidth="lg">
      {!castId ? (
        <StyledPaper>
          <Typography variant="h5" align="center" color="error" gutterBottom>
            認証エラー
          </Typography>
          <Typography align="center">
            キャスト情報が取得できませんでした。再度ログインしてください。
          </Typography>
        </StyledPaper>
      ) : (
        <>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#d9467e',
                  letterSpacing: '0.5px',
                  fontSize: '1.1rem'
                }}
              >
                ミニログ
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
              >
                新規投稿
              </Button>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            {showForm ? (
              <PostForm 
                post={editingPost || undefined} 
                onSuccess={handleFormSuccess} 
                onCancel={handleFormCancel} 
              />
            ) : (
              <PostList 
                castId={castId} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
                refreshTrigger={refreshTrigger}
              />
            )}
          </StyledPaper>

          {/* 削除確認ダイアログ */}
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
          >
            <DialogTitle>投稿の削除</DialogTitle>
            <DialogContent>
              <Typography>この投稿を削除してもよろしいですか？この操作は元に戻せません。</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>キャンセル</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                削除する
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* 通知 */}
      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification?.type || 'info'} 
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostsPage;
