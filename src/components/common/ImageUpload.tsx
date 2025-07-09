import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import useUser from '@/hooks/useUser';

const UploadBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const HiddenInput = styled('input')(() => ({
  display: 'none',
}));

interface ImageUploadProps {
  onUploadComplete: (url: string, mediaId?: number) => void;
  initialImage?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUploadComplete, 
  initialImage = '',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useUser();
  const token = user?.token;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleUploadClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // 画像ファイルのみ許可
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルのみアップロードできます');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      console.log('🖼️ 画像アップロード開始:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        token: token ? 'あり' : 'なし',
        apiUrl: apiUrl
      });
      
      // 1. 署名付きURLを取得
      const urlResponse = await axios.post(
        `${apiUrl}/api/v1/media/upload/generate-url`,
        {
          file_name: file.name,
          file_type: file.type,  // S3の署名付きURL生成時はファイルタイプを固定で`image`を使用
          target_type: 'blog',  // ブログ用の画像
          target_id: 0,         // 新規投稿の場合は仮のID
          order_index: 0        // メイン画像
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30秒のタイムアウト
        }
      );
      
      console.log('署名付きURL取得成功:', urlResponse.data);
      
      const presignedUrl = urlResponse.data.presigned_url;
      if (!presignedUrl) {
        throw new Error('署名付きURL取得失敗');
      }
      
      // 2. 署名付きURLにファイルを直接アップロード
      console.log('📤 S3へのアップロード開始');
      await axios.put(
        presignedUrl,
        file,
        {
          headers: {
            'Content-Type': file.type
          },
          timeout: 60000, // 60秒のタイムアウト（大きいファイル用）
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
              console.log(`📡 アップロード進捗: ${percentCompleted}%`);
            }
          }
        }
      );
      
      console.log('S3アップロード成功');
      
      // 3. S3のURLからパブリックURLを生成
      // 署名付きURLからパブリックURLに変換（URLのクエリパラメータを削除）
      const publicUrl = presignedUrl.split('?')[0];
      
      // 4. 必要に応じて、アップロード情報をDBに登録
      console.log('📝 メディア情報をDBに登録中');
      const mediaResponse = await axios.post(
        `${apiUrl}/api/v1/media/upload/register`,
        {
          file_url: publicUrl,
          file_name: file.name,
          file_type: 'image',  // 画像ファイルタイプを固定で`image`を使用
          target_type: 'blog',
          target_id: 0,
          order_index: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30秒のタイムアウト
        }
      );
      
      console.log('メディア情報登録成功:', mediaResponse.data);
      
      // メディアIDを取得
      const mediaId = mediaResponse.data.id;
      
      setImageUrl(publicUrl);
      // メディアIDも一緒に渡す
      onUploadComplete(publicUrl, mediaId);
      
    } catch (err: any) {
      console.error('❌ 画像アップロードエラー:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: err.message,
        code: err.code
      });
      
      // エラーメッセージの決定
      let errorMessage = '画像のアップロードに失敗しました';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'アップロードがタイムアウトしました。もう一度お試しください。';
      } else if (err.response?.status === 413) {
        errorMessage = 'ファイルサイズが大きすぎます';
      } else if (err.response?.status === 401) {
        errorMessage = '認証エラー。再度ログインしてください。';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // input要素をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onUploadComplete('');
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {imageUrl ? (
        <Box sx={{ textAlign: 'center' }}>
          <PreviewImage src={imageUrl} alt="アップロード画像" />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleUploadClick}
              disabled={disabled || uploading}
              sx={{ mr: 1 }}
            >
              画像を変更
            </Button>
            <IconButton 
              color="error" 
              onClick={handleRemoveImage}
              disabled={disabled || uploading}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <UploadBox onClick={handleUploadClick}>
          {uploading ? (
            <>
              <CircularProgress 
                size={40} 
                variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
                value={uploadProgress}
              />
              {uploadProgress > 0 && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {uploadProgress}%
                </Typography>
              )}
            </>
          ) : (
            <>
              <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                クリックして画像をアップロード
              </Typography>
              <Typography variant="caption" color="textSecondary" align="center">
                JPG, PNG, GIF形式 (最大5MB)
              </Typography>
            </>
          )}
        </UploadBox>
      )}
      
      <HiddenInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />
    </Box>
  );
};

export default ImageUpload;
