import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Post, PostCreateData, PostUpdateData } from '../types';
import usePosts from '../api/usePosts';
import ImageUpload from '../../../../../../components/common/ImageUpload';
import axios from 'axios';
import useUser from '@/hooks/useUser';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

interface PostFormProps {
  post?: Post;
  onSuccess: () => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<PostCreateData | PostUpdateData>({
    body: '',
    photo_url: '',
    status: 'public',
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tempMediaId, setTempMediaId] = useState<number | null>(null); // 一時的なメディアIDを保存
  const { createPost, updatePost, loading, error } = usePosts();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = useUser();
  const token = user?.token;

  // 編集時のデータ初期化
  useEffect(() => {
    if (post) {
      setFormData({
        body: post.body,
        photo_url: post.photo_url || '',
        status: post.status,
      });
      if (post.photo_url) {
        setImageUrl(post.photo_url);
      }
    }
  }, [post]);

  // TextField用の変更処理
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Select用の変更処理
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (url: string, mediaId?: number) => {
    setImageUrl(url);
    setFormData(prev => ({ ...prev, photo_url: url }));
    if (mediaId) {
      setTempMediaId(mediaId);
    }
  };

  const validateForm = () => {
    if (!formData.body || formData.body.trim() === '') {
      setFormError('投稿内容を入力してください');
      return false;
    }
    return true;
  };

  // 画像と投稿を紐付ける処理
  const updateMediaWithPostId = async (postId: number) => {
    if (!tempMediaId || !token) return;
    
    try {
      console.log(`画像(ID: ${tempMediaId})をブログ(ID: ${postId})に紐付けます`);
      
      await axios.post(
        `${apiUrl}/api/v1/media/upload/update-target`,
        {
          media_id: tempMediaId,
          target_type: 'blog',
          target_id: postId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('画像とブログの紐付けが完了しました');
    } catch (err) {
      console.error('画像とブログの紐付けに失敗しました:', err);
      // 紐付けに失敗しても投稿自体は成功してているので、エラーはログだけに残す
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      let savedPost;
      
      if (post) {
        // 更新処理
        savedPost = await updatePost({
          ...formData,
          id: post.id
        } as PostUpdateData);
        
        // 既存の投稿を更新する場合も、新しい画像がアップロードされていれば紐付けを更新
        if (tempMediaId && savedPost) {
          await updateMediaWithPostId(savedPost.id);
        }
      } else {
        // 新規作成処理
        savedPost = await createPost(formData as PostCreateData);
        
        // 新規投稿の場合、画像がアップロードされていれば紐付けを更新
        if (tempMediaId && savedPost) {
          await updateMediaWithPostId(savedPost.id);
        }
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('投稿の保存に失敗しました:', err);
      setFormError(err.message || '投稿の保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h5" component="h2" gutterBottom>
        {post ? '投稿を編集' : '新しい投稿を作成'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {(formError || error) && (
            <Alert severity="error">
              <AlertTitle>エラー</AlertTitle>
              {formError || error}
            </Alert>
          )}
          
          <TextField
            name="body"
            label="投稿内容"
            multiline
            rows={4}
            value={formData.body}
            onChange={handleTextFieldChange}
            fullWidth
            required
            error={formError?.includes('投稿内容')}
            helperText={formError?.includes('投稿内容') ? formError : ''}
            disabled={isSubmitting}
          />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              画像をアップロード（任意）
            </Typography>
            <ImageUpload 
              onUploadComplete={handleImageUpload} 
              initialImage={imageUrl}
              disabled={isSubmitting}
            />
          </Box>
          
          <FormControl fullWidth>
            <InputLabel id="status-label">公開ステータス</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              label="公開ステータス"
              disabled={isSubmitting}
            >
              <MenuItem value="public">公開</MenuItem>
              <MenuItem value="private">非公開</MenuItem>
              <MenuItem value="draft">下書き</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? '保存中...' : (post ? '更新する' : '投稿する')}
            </Button>
          </Box>
        </Stack>
      </form>
    </StyledPaper>
  );
};

export default PostForm;
