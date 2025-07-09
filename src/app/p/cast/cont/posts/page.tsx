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

export default function PostsPage() {
  console.log('🎯 PostsPage コンポーネントがレンダリングされました');
  
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { createPost, updatePost, deletePost, loading, error } = usePosts();
  const user = useUser();

  const castId = 406; // 一時的にハードコード

  const handleOpen = () => {
    setEditingPost(null);
    setOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (postData: any) => {
    try {
      if (editingPost) {
        await updatePost({ id: editingPost.id, ...postData });
        setSnackbarMessage('投稿を更新しました');
      } else {
        await createPost(postData);
        setSnackbarMessage('投稿を作成しました');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setRefreshTrigger(prev => prev + 1);
      handleClose();
    } catch (error) {
      console.error('投稿の保存に失敗:', error);
      setSnackbarMessage('投稿の保存に失敗しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm('この投稿を削除しますか？')) {
      try {
        await deletePost(postId);
        setSnackbarMessage('投稿を削除しました');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('投稿の削除に失敗:', error);
        setSnackbarMessage('投稿の削除に失敗しました');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ミニログ
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            disabled={loading}
          >
            新しい投稿
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <PostList
          castId={castId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshTrigger={refreshTrigger}
        />

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPost ? '投稿を編集' : '新しい投稿を作成'}
          </DialogTitle>
          <DialogContent>
            <PostForm
              onSubmit={handleSubmit}
              onCancel={handleClose}
              initialData={editingPost}
              castId={castId}
              loading={loading}
            />
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Container>
  );
}
